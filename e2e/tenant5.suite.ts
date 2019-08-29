import { SignupTestService,
  LoginTestService,
  HomeTestService,
  TopNavigationTestService,
  AgentCardTestService,
  TranscationTestService,
  ActivityTestService,
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


signupTestService.signupSpecTest();
loginTestService.loginSpecTest();
homeTestService.homeSpecTest();
topNavTestService.topNavigationSpecTest();
agentCardTestService.agentCardSpecTest();
transcationTestService.transcationSpecTest();
activityTestService.activitySpecTest();
propertyTestService.propertySpecTest();
profileTestService.profileSpecTest();
