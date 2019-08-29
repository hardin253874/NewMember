import { AppWideEventService } from '../_services/app-wide-events.service';
import { PortalSession } from '../_services';
import { Component, OnInit, Input }              from '@angular/core';
import {TenancyService, TenancyInfo, GetTenantResponse}    from './services/tenancy.service';
import { Property, PropertyService } from '../property/services/property.service';
import { AgentInfo } from '../agent-card/services/agent.service';
import * as moment from 'moment';
import { NgbModal, NgbModalRef }          from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-renting-card',
  templateUrl: './renting-card.component.html',
  styleUrls: ['./renting-card.component.scss']
})
export class RentingCardComponent implements OnInit {

  @Input() tenant: TenancyInfo;
  @Input() isSummary: boolean;
    popupRef: NgbModalRef;
    isLoaded = false;
    property : Property;
  agentInfo: AgentInfo;
  photoSize: string;
  bingImageHeight: string;
  constructor(
    private propertyService: PropertyService,
    private router: Router,
    public portalSession : PortalSession,
    private eventService : AppWideEventService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.bingImageHeight = '150px';
    this.load();

    // this.eventService.currentTenantEvent$.subscribe(event => this.load());
  }

  load() {
    this.agentInfo = this.portalSession.defaultAgent;

    this.photoSize = this.isSummary ? 'S' : 'L';
    if (this.portalSession && this.portalSession.currentTenant){
      const folioId = this.portalSession.currentTenant.Id;
      const lotId = this.portalSession.currentTenant.LotId; // for multiple ownerships

      this.propertyService.getProperty(folioId, lotId)
        .then(
          property => {
            this.isLoaded = true;
            this.property = property;
            if (!this.property.PartPaid) {
                this.property.PartPaid = 0;
            }

            if (!this.property.Deposited) {
                this.property.Deposited = 0;
            }
          }
        );
    }
  }

  getDaysInArrears() {
    if (this.property && this.property.EffectivePaidTo) {
      return moment().diff(this.property.EffectivePaidTo, 'days');
    }

    return 0;
  }

  onSelect(tenancy: TenancyInfo) {
    this.router.navigate(['/property', tenancy.Id, tenancy.LotId]);
  }

  getFullAddress(tenancy: TenancyInfo) {
    if (tenancy && tenancy.Address) {
      return tenancy.Address.Text.split('\n');
    }

    return null;
  }

  displayFullAddress(tenancy: TenancyInfo) {
    const fullAddress = this.getFullAddress(tenancy);

    if (fullAddress) {
       let addressContent = '';

       for (let i = 0; i < fullAddress.length; i++) {
         const addressline = i === 0 ? '<b>' + fullAddress[i] + '</b><br>' : fullAddress[i] + '<br>';
         addressContent += addressline;
       }

      return addressContent;
    }

    return '';
  }

    wrapAddress(lineNumber: number) {
      if (this.property && this.property.MultipleLineAddressText) {

          let fullAddress = this.property.MultipleLineAddressText;
          // remove building name to fit the space
          if (this.property.Address.BuildingName) {
              fullAddress = this.property.MultipleLineAddressText.replace(this.property.Address.BuildingName,'').trim();
          }

          // if full address contains two ',,' by system, instead of ','
          fullAddress = fullAddress.replace(',,', ',');
          const addressLength = fullAddress.split(',').length;

          if (addressLength === 1) {
              if (lineNumber === 0) {
                  return this.property.Address.Text;
              }else {
                  return '';
              }
          } else if (addressLength === 2) {
              return fullAddress.split(',')[lineNumber];
          } else if (addressLength === 3) {
              if (lineNumber === 0) {
                  return fullAddress.split(',')[0] + ' ' + fullAddress.split(',')[1];
              } else {
                  return fullAddress.split(',')[2]
              }
          }
          else {
              if (lineNumber === 0) {
                  return this.property.Address.Text;
              }else {
                  return '';
              }

          }
      } else {
          return '';
      }

  }



  displayMoveOutLabel() {
    const today = new Date();
    if (this.property.TenancyEnd >= today) {
      return 'Moving out';
    }else {
      return 'Moved out';
    }
  }
}
