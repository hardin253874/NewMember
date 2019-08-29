import { browser } from 'protractor/built';
import { SignupTestService,
  LoginTestService,
  HomeTestService,
  TopNavigationTestService,
  AgentCardTestService,
  TranscationTestService,
  ActivityTestService,
  DocumentTestService,
  PropertyTestService,
  ProfileTestService
} from './index';



const signupTestService = new SignupTestService();
const loginTestService = new LoginTestService();
const homeTestService = new HomeTestService();
const topNavTestService = new TopNavigationTestService();
const agentCardTestService = new AgentCardTestService();
const transcationTestService = new TranscationTestService();
const activityTestService = new ActivityTestService();
const propertyTestService = new PropertyTestService();
const profileTestService = new ProfileTestService();
const documentTestService = new DocumentTestService();
browser.params.userName = 'Tenant1test@propertyme.com';

signupTestService.signupSpecTest();
loginTestService.loginSpecTest();
homeTestService.homeSpecTest();
topNavTestService.topNavigationSpecTest();
agentCardTestService.agentCardSpecTest();
transcationTestService.transcationSpecTest();
activityTestService.activitySpecTest();
documentTestService.documentSpecTest();
propertyTestService.propertySpecTest();
profileTestService.profileSpecTest();

