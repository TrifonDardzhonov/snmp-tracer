import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LineChartComponent } from './lineChart/line-chart-component';
import { PieChartComponent } from './pieChart/pie-chart-component';


@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
