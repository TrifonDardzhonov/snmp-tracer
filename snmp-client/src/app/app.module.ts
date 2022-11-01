import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {PieChartComponent} from "./pieChart/pie-chart-component";
import {SNMPEndpointFormComponent} from "./snmpEndpoint/snmp-endpoint-form.component";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {SNMPService} from "./snmpService/snmp-service";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {CsvService} from './snmpService/csv-service';

@NgModule({
  declarations: [AppComponent, PieChartComponent, SNMPEndpointFormComponent],
  imports: [BrowserModule, FormsModule, BrowserAnimationsModule, HttpClientModule, OwlDateTimeModule, OwlNativeDateTimeModule],
  providers: [SNMPService, CsvService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
