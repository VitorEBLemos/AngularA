import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { WeatherDatas } from './../../../../models/interfaces/WeatherDatas';
import { WeatherService } from './../../services/weather.service';

@Component({
  selector: 'app-weather-home',
  templateUrl: './weather-home.component.html',
  styleUrls: []
})
export class WeatherHomeComponent implements OnInit, OnDestroy {
  constructor(private weatherService: WeatherService){ }

  private readonly destroy$: Subject<void> = new Subject();
  initialCityName = 'Aracaju'
  weatherDatas!: WeatherDatas;
  searchIcon = faMagnifyingGlass;

  ngOnInit(): void {
    this.getWeatherDatas(this.initialCityName);
  }

  getWeatherDatas(cityName: string): void{
    this.weatherService.getWeatherDatas(cityName)
    .pipe(
      takeUntil(this.destroy$) // aqui sera feito a desinscrição da assinatura e evita o memory leak ou vazamento de memoria
    )
    .subscribe({
      next: (response) => {
        response && (this.weatherDatas = response);
        console.log(this.weatherDatas)
      },
      error: (error) => console.log(error),
    })
  }

  onSubmit(): void{
    console.log('Chamou')
    this.getWeatherDatas(this.initialCityName);
    this.initialCityName = '';
  }

  ngOnDestroy(): void {// Significa q quando sair da tela determinada ele vai desmontar todo o codigo a cima e deixar "inoperante" e assim que voltar a tela ele entra no ngOnInit
    this.destroy$.next();
    this.destroy$.complete();
  }

}
