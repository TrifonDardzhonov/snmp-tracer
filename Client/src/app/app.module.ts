import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LineChartComponent } from './lineChart/line-chart-component';
import { PieChartComponent } from './pieChart/pie-chart-component';
import { SNMPService } from './snmpService/snmp-service';
import { AlertModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    AlertModule.forRoot()
  ],
  providers: [SNMPService],
  bootstrap: [AppComponent]
})
export class AppModule { }
