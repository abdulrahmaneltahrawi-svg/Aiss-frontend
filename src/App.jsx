import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home/index.jsx";
import AboutBrief from "./components/pages/about/AboutBrief.jsx";
import AboutGoals from "./components/pages/about/AboutGoals.jsx";
import AboutServices from "./components/pages/about/AboutServices.jsx";
import AboutManager from "./components/pages/about/AboutManager.jsx";
import Gover from "./components/pages/about/Gover.jsx";
import Creator from "./components/pages/about/Creator.jsx";
import ExecutiveManagement from "./components/pages/about/ExecutiveManagement.jsx";
import Magazines from "./components/pages/books/Magazines.jsx";
import Articles from "./components/pages/articles/articles.jsx";
import Books from "./components/pages/books/Books.jsx";
import Code from "./components/pages/articles/Code.jsx";
import ViewArticle from "./components/pages/articles/ViewArticle.jsx";
import TagArticles from "./components/pages/articles/TagArticles.jsx";
import Conferences from "./components/pages/events/Conferences.jsx";
import FlipBook from "./components/pages/books/FlipBook.jsx";
import Medal from "./components/pages/medal/Medal.jsx";
import Events from "./components/pages/events/Competitions.jsx";
import EventAdd from "./components/pages/events/EventAdd.jsx";
import Clients from "./components/pages/clients/Partners.jsx";
import Actors from "./components/pages/clients/Representatives.jsx";
import Store, { Certificate } from "./components/pages/certificate/Certificate.jsx";
import View from "./components/pages/certificate/View.jsx";
import Payment from "./components/pages/certificate/Payment.jsx";
import About from "./components/links/About.jsx";
import Inquiries from "./components/links/Inquiries.jsx";
import Jobs from "./components/links/Jobs.jsx";
import News from "./components/links/News.jsx";
import AgreementPrivacy from "./components/links/AgreementPrivacy.jsx";
import AgreementTerm from "./components/links/AgreementTerm.jsx";

// Admin imports
import Dashboard from "./components/Admin/Dashboard.jsx";
import Add_article from "./components/Admin/Add_article.jsx";
import Add_magazine from "./components/Admin/Add_magazine.jsx";
import Add_book from "./components/Admin/Add_book.jsx";
import Add_tag from "./components/Admin/Add_tag.jsx";
import Add_Accred from "./components/Admin/Add_Accred.jsx";
import Add_certificates from "./components/Admin/Add_certificates.jsx";
import Edit_article from "./components/Admin/Edit_article.jsx";
import Edit_book from "./components/Admin/Edit_book.jsx";
import Edit_magazine from "./components/Admin/Edit_magazine.jsx";
import Comment from "./components/Admin/Manage_comment.jsx";
import Add_code from "./components/Admin/Add_code.jsx";
import Edit_code from "./components/Admin/Edit_code.jsx";
import Add_conferences from "./components/Admin/Add_conferences.jsx";
import Add_Competitions from "./components/Admin/Add_Competitions.jsx";
import Edit_Competitions from "./components/Admin/Edit_Competitions.jsx";
import Edit_conferences from "./components/Admin/Edit_conferences.jsx";
import Add_actor from "./components/Admin/Add_actor.jsx";
import Edit_actor from "./components/Admin/Edit_actor.jsx";
import Manage_actor from "./components/Admin/Manage_actor.jsx";
import Add_event from "./components/Admin/Add_event.jsx";
import Edit_event from "./components/Admin/Edit_event.jsx";
import Manage_event from "./components/Admin/Manage_event.jsx";
import ConferenceDetails from "./components/pages/events/View_Events.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About_brief" element={<AboutBrief />} />
        <Route path="/About_golas" element={<AboutGoals />} />
        <Route path="/About_services" element={<AboutServices />} />
        <Route path="/About_manger" element={<AboutManager />} />
        <Route path="/gover" element={<Gover />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/executive-management" element={<ExecutiveManagement />} />
        <Route path="/magazine" element={<Magazines />} />
        <Route path="/blogs" element={<Articles />} />
        <Route path="/manuals" element={<Books />} />
        <Route path="/cods" element={<Code />} />
        <Route path="/views" element={<ViewArticle />} />
        <Route path="/tag-articles" element={<TagArticles />} />
        <Route path="/flipbook" element={<FlipBook />} />
        <Route path="/conference" element={<Conferences />} />
        <Route path="/conferences" element={<Conferences />} />
        <Route path="/conferences/:id" element={<ConferenceDetails />} />
        <Route path="/competitions" element={<Events />} />
        <Route path="/competitions/:id" element={<ConferenceDetails />} />
        <Route path="/event/:id" element={<ConferenceDetails />} />
        <Route path="/medal" element={<Medal />} />
        <Route path="/event" element={<Events />} />
        <Route path="/event_add" element={<EventAdd />} />
        <Route path="/verify" element={<Certificate />} />
        <Route path="/companies" element={<Clients />} />
        <Route path="/actors" element={<Actors />} />
        <Route path="/certificate" element={<Store />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/view/:id" element={<View />} />
        <Route path="/store/payment" element={<Payment />} />
        <Route path="/about" element={<About />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy" element={<AgreementPrivacy />} />
        <Route path="/terms" element={<AgreementTerm />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/comments" element={<Comment />} />
        <Route path="/admin/add-article" element={<Add_article />} />
        <Route path="/admin/add-magazine" element={<Add_magazine />} />
        <Route path="/admin/add-book" element={<Add_book />} />
        <Route path="/admin/add-tag" element={<Add_tag />} />
        <Route path="/admin/add-accred" element={<Add_Accred />} />
        <Route path="/admin/add-certificates" element={<Add_certificates />} />
        <Route path="/admin/edit-article/:id" element={<Edit_article />} />
        <Route path="/admin/edit-book/:id" element={<Edit_book />} />
        <Route path="/admin/edit-magazine/:id" element={<Edit_magazine />} />
        <Route path="/admin/add-code" element={<Add_code />} />
        <Route path="/admin/edit-code/:id" element={<Edit_code />} />
        <Route path="/admin/add-conferences" element={<Add_conferences />} />
        <Route path="/admin/add-competitions" element={<Add_Competitions />} />
        <Route path="/admin/add-actor" element={<Add_actor />} />
        <Route path="/admin/edit-actor/:id" element={<Edit_actor />} />
        <Route path="/admin/manage-actors" element={<Manage_actor />} />
        <Route path="/admin/add-event" element={<Add_event />} />
        <Route path="/admin/edit-event/:id" element={<Edit_event />} />
        <Route path="/admin/manage-events" element={<Manage_event />} />
        <Route path="/admin/edit-competition/:id" element={<Edit_Competitions />} />
        <Route path="/admin/edit-conference/:id" element={<Edit_conferences />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;