import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { LeadModalProvider } from '@/components/LeadModal';
import CookieConsent from '@/components/CookieConsent';
import UtmCapture from '@/components/UtmCapture';

import SiteLayout from '@/components/site/SiteLayout';
import Home from '@/pages/Home';
import Exchange from '@/pages/Exchange';
import InvoicePayments from '@/pages/InvoicePayments';
import Otc from '@/pages/Otc';
import Markets from '@/pages/Markets';
import HowItWorks from '@/pages/HowItWorks';
import Pricing from '@/pages/Pricing';
import Security from '@/pages/Security';
import About from '@/pages/About';
import Faq from '@/pages/Faq';
import LegalPage from '@/pages/LegalPage';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router basename={routerBasename}>
          <LeadModalProvider>
            <CookieConsent />
            <UtmCapture />
            <ScrollToTop />
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/invoice-payments" element={<InvoicePayments />} />
                <Route path="/otc" element={<Otc />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/security" element={<Security />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/legal/:slug" element={<LegalPage />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </LeadModalProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
