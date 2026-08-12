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
import Conferences from "./components/pages/conferences/Conferences.jsx";
import FlipBook from "./components/pages/books/FlipBook.jsx";
import Medal from "./components/pages/medal/Medal.jsx";
import Events from "./components/pages/events/Events.jsx";
import EventAdd from "./components/pages/events/EventAdd.jsx";
import Certificate from "./components/pages/certificate/Certificate.jsx";
import Clients from "./components/pages/clients/Clients.jsx";
import Actors from "./components/pages/actors/Actors.jsx";
import Store from "./components/pages/store/Store.jsx";
import View from "./components/pages/store/View.jsx";
import Payment from "./components/pages/store/Payment.jsx";
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
import Add_certificate from "./components/Admin/Add_certificate.jsx";
import Edit_article from "./components/Admin/Edit_article.jsx";
import Edit_book from "./components/Admin/Edit_book.jsx";
import Edit_magazine from "./components/Admin/Edit_magazine.jsx";

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
        <Route path="/flipbook" element={<FlipBook />} />
        <Route path="/conference" element={<Conferences />} />
        <Route path="/conferences" element={<Conferences />} />
        <Route path="/medal" element={<Medal />} />
        <Route path="/event" element={<Events />} />
        <Route path="/event_add" element={<EventAdd />} />
        <Route path="/verify" element={<Certificate />} />
        <Route path="/companies" element={<Clients />} />
        <Route path="/actors" element={<Actors />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/view" element={<View />} />
        <Route path="/store/payment" element={<Payment />} />
        <Route path="/about" element={<About />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy" element={<AgreementPrivacy />} />
        <Route path="/terms" element={<AgreementTerm />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/add-article" element={<Add_article />} />
        <Route path="/admin/add-magazine" element={<Add_magazine />} />
        <Route path="/admin/add-book" element={<Add_book />} />
        <Route path="/admin/add-tag" element={<Add_tag />} />
        <Route path="/admin/add-certificate" element={<Add_certificate />} />
        <Route path="/admin/edit-article" element={<Edit_article />} />
        <Route path="/admin/edit-book" element={<Edit_book />} />
        <Route path="/admin/edit-magazine" element={<Edit_magazine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;