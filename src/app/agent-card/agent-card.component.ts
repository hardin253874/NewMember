import { PortalSession } from '../_services';
import { Component, OnInit, Input } from '@angular/core';
import { AgentInfo, AgentService } from './services/agent.service';
import { AuthenticationService }    from '../_services/index';

@Component({
  selector: 'app-agent-card',
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss']
})
export class AgentCardComponent implements OnInit {
  agentInfo: AgentInfo;
  avatarUrl: string;
  agentDisplay: string;
  hasManager: boolean;
  constructor(
    private portalSession: PortalSession
  ) { }

  ngOnInit() {
      this.agentInfo =  this.portalSession.defaultAgent;

      this.avatarUrl = 'member/avatar.png?';

      if (this.agentInfo.MemberId) {
        this.avatarUrl += '&ImageSize=L&MemberId=' + this.agentInfo.MemberId;
      }

      if (this.agentInfo.MemberId) {
          if (this.agentInfo.ManagerFirstName || this.agentInfo.ManagerLastName) {
              this.agentDisplay = this.agentInfo.ManagerFirstName + ' ' + this.agentInfo.ManagerLastName;
          }


          if (this.agentDisplay.trim().length === 0) {
              this.agentDisplay = this.agentInfo.ManagerEmail;
          }
      }else {
          if (!this.agentInfo.Email) {
              this.agentInfo.Email = this.agentInfo.ToAgentEmail;
          }

          this.agentDisplay = this.agentInfo.Email;
      }



  }
}
