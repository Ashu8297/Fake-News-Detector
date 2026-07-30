import React from 'react';
import PremiumLoginPage from './PremiumLoginPage';

export default function LoginPage({ setActivePage, showToast }) {
  return <PremiumLoginPage setActivePage={setActivePage} showToast={showToast} />;
}
