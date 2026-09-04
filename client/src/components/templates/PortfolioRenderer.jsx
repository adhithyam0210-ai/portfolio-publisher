import React from 'react';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { TerminalTemplate } from './TerminalTemplate';
import { EditorialTemplate } from './EditorialTemplate';
import { BrutalistTemplate } from './BrutalistTemplate';

export const PortfolioRenderer = ({ data }) => {
  if (!data) return null;

  const { portfolio = {} } = data;
  const templateName = portfolio.template || 'modern';
  const theme = portfolio.theme || 'dark';
  const accentColor = portfolio.accent_color || '#6366f1';
  const fontFamily = portfolio.font_family || 'Inter';

  // Parse section_visibility if string
  let visibility = {};
  if (portfolio.section_visibility) {
    if (typeof portfolio.section_visibility === 'string') {
      try {
        visibility = JSON.parse(portfolio.section_visibility);
      } catch (e) {
        visibility = {};
      }
    } else {
      visibility = portfolio.section_visibility;
    }
  }

  const enrichedData = {
    ...data,
    visibility
  };

  const styleWrapper = {
    '--user-accent': accentColor,
    '--primary': accentColor,
    fontFamily: `"${fontFamily}", system-ui, sans-serif`
  };

  return (
    <div style={styleWrapper} className="portfolio-template-wrapper">
      {templateName === 'professional' && <ProfessionalTemplate data={enrichedData} theme={theme} />}
      {templateName === 'modern' && <ModernTemplate data={enrichedData} theme={theme} />}
      {templateName === 'minimal' && <MinimalTemplate data={enrichedData} theme={theme} />}
      {templateName === 'creative' && <CreativeTemplate data={enrichedData} theme={theme} />}
      {templateName === 'terminal' && <TerminalTemplate data={enrichedData} theme={theme} />}
      {templateName === 'editorial' && <EditorialTemplate data={enrichedData} theme={theme} />}
      {templateName === 'brutalist' && <BrutalistTemplate data={enrichedData} theme={theme} />}
    </div>
  );
};
