import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {PieChartComponent} from './pieChart/pie-chart-component';
import {SNMPService} from './snmpService/snmp-service';
import {AlertModule} from 'ngx-bootstrap';
import {SNMPEndpointFormComponent} from './snmpEndpoint/snmp-endpoint-form.component';
import {HttpClientModule} from '@angular/common/http';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, PieChartComponent, SNMPEndpointFormComponent],
  imports: [BrowserModule, AlertModule.forRoot(), FormsModule, BrowserAnimationsModule, HttpClientModule, OwlDateTimeModule, OwlNativeDateTimeModule],
  providers: [SNMPService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
