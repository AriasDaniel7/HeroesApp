import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

type Info = 'invalid' | 'updated' | 'created' | 'deleted';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})

export class NewPageComponent implements OnInit {
  public nameHero: string = '';
  // * Para tomar todos los datos del formulario
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  // * Para seleccionar el publisher del formulario
  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      this.nameHero = `Crear heroe`;
      return;
    };

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      ).subscribe(hero => {
        if (!hero) return this.router.navigate(['/']);
        this.heroForm.reset(hero);
        this.nameHero = `Editar / ${hero.superhero}`;
        return;
      });

  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      this.showSnackbar('Complete los campos requeridos!', 'invalid');
      return;
    }
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.nameHero = `Editar / ${hero.superhero}`;
          this.showSnackbar(`${hero.superhero} actualizado con exito!`, 'updated')
        })
      return;
    }
    if (!this.currentHero.alt_img) {
      this.currentHero.alt_img = 'assets/no-image.png';
    }
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} creado correctamente!`, 'created');
      })
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required!');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      ).subscribe(() => {
        this.showSnackbar(`${this.currentHero.superhero} fue eliminado correctamente!`, 'deleted')
        this.router.navigate(['/heroes']);
      });
  }

  showSnackbar(message: string, info: Info): void {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2400,
      panelClass: [info === 'invalid' ? 'red-snackbar' : info === 'updated' ? 'purple-snackbar' : info === 'created' ? 'green-snackbar' : info === 'deleted' ? 'black-snackbar' : '']
    })
  }
}
