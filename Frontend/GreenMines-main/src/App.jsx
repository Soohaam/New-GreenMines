import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Companies from './Components/Companies';
import Services from './Components/Services';
import Experience from './Components/Experience';
import Projects from './Components/Projects';
import Clients from './Components/Clients';
import Footer from './Components/Footer';
import ScrollArrow from './Components/ScrollArrow';
import Emission from './Components/Emission';
import './app.css';
import Neutrality from './Components/Neutrality';
import NeutralityResult from './Components/NeutralityResult';
import AboutUs from './Components/AboutUs';
import AboutUsPage from './Components/AboutUsPage';
import ContactUs from './Components/ContactUs';
import GraphPage from './Components/GraphPage';
import DashBoard from './Components/DashBoard';
import Renewable from './Components/RenewableSource';
import ChatBot from './Components/Chatbot';
import CCSCalculator from './Components/CCS';
import EmissionsAnalysisPage from "./Components/EmissionsAnalysisPage";
import AFOLUForm from './Components/AFOLUForm';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import Login from './Components/Login';
import Enable2FA from './Components/Enable2FA';
import Verify2FA from './Components/Verify2FA';
import Register from './Components/Register';
import MovingText from './Components/MarqueeText';
import Prediction from './Components/Predictions'
import NeutralityOptions from './Components/NeutralityOptions';
import ChatAssistant from './Components/ChatAssistant';
import Profile from './Components/Profile';
import EnvironmentalReportPage from './pages/EnvironmentalReportPage';
import Routing from './Components/RouteFrm'
import { MarqueeReviews } from './Components/ReviewCard';
import CoalEmission from './Components/CoalEmission';
import EvSavingsCalculator from './Components/EvSavingsCalculator';
import MCS from './Components/MCS';
import MCSCalculator from './Components/MCS';
import RequiredLand from "./Components/RequiredLand"
import RegenerativeZoneMap from './Components/RegenerativeZoneMap';
import NeutralityGraph from './Components/NeutralityGraph';
function App() {
  return (
    <div className="App font-link">
    
     
      <Routes>
      <Route path="/" element={
          <>
          <ChatAssistant />
            <Header id="home" />
            <MovingText
        text="Sustainable Future Green World"
        fontSize={100}
        outlineColor="#10B981"
        fillColor="#10B981"
        duration={8}
      />
            <ScrollArrow />
            {/* <Companies id="about" /> */}
            <Services id="services" />
            {/* <Experience /> */}
            <Projects id="projects" />
            <MarqueeReviews/>
            <Clients />
            <Footer />
          </>
        } />
        <Route path="/services" element={<Services id="services" />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects id="projects" />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/emission" element={<Emission />} />
        <Route path="/neutrality" element={<Neutrality />} />
        <Route path="/neutralityresult" element={<NeutralityResult />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/graphpage" element={<GraphPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/renewable" element={<Renewable />} />
        <Route path="/chatbot" element={<ChatBot/>} />
        <Route path="/CCS" element={<CCSCalculator/>}/>
        <Route path="/MCS" element={<MCS/>}/>
        <Route path="/emissions-analysis" element={<EmissionsAnalysisPage />} />
        <Route path="/afolu" element={<AFOLUForm />} />
        <Route path="/predictions" element={<Prediction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup-2fa" element={<Enable2FA />} />
        <Route path="/verify-2fa" element={<Verify2FA />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/neutralityoptions" element={<NeutralityOptions />} />
        <Route path="/chatassistant" element={<ChatAssistant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/environmental-reports" element={<EnvironmentalReportPage />} />
        <Route path="/routing" element={<Routing />} />
        <Route path='/coalemission' element={<CoalEmission/>}/>
        <Route path='/ev' element={<EvSavingsCalculator/>}/>
        <Route path='/requiredland' element={<RequiredLand/>}/>
        <Route path='/zone' element={<RegenerativeZoneMap />} />
        <Route path='/neutralitygraph' element={<NeutralityGraph />} />
      </Routes>
      
    </div>
  );
}

export default App;
