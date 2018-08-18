import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LineChartComponent } from './lineChart/line-chart-component';
import { PieChartComponent } from './pieChart/pie-chart-component';
import { SNMPService } from './snmpService/snmp-service';
import { AlertModule } from 'ngx-bootstrap';
import { SNMPEndpointFormComponent } from './snmpEndpoint/snmp-endpoint-form.component';
import { HttpClientModule } from '../../node_modules/@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    PieChartComponent,
    SNMPEndpointFormComponent
  ],
  imports: [
    BrowserModule,
    AlertModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [SNMPService],
  bootstrap: [AppComponent]
})
export class AppModule { }
