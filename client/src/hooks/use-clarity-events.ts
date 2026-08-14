import { useCallback } from 'react';

declare global {
  interface Window {
    clarity: any;
  }
}

export const useClarityEvents = () => {
  const trackEvent = useCallback((eventName: string, data: Record<string, any> = {}) => {
    try {
      if (window.clarity) {
        window.clarity('event', eventName, data);
        console.log(`Clarity Event: ${eventName}`, data);
      }
    } catch (error) {
      console.error('Erro ao enviar evento Clarity:', error);
    }
  }, []);

  // Eventos específicos do funil
  const trackGenderSelection = useCallback((gender: string, page: string) => {
    trackEvent('gender_selected', {
      gender,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackPixCodeCopy = useCallback((amount: number, method: 'click' | 'manual') => {
    trackEvent('pix_code_copied', {
      amount,
      copy_method: method,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackPixQRCodeView = useCallback((amount: number, timeOnScreen: number) => {
    trackEvent('pix_qr_viewed', {
      amount,
      time_on_screen_seconds: timeOnScreen,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackFormFieldCompleted = useCallback((fieldName: string, value: string, page: string) => {
    trackEvent('form_field_completed', {
      field_name: fieldName,
      field_value: value.length > 50 ? `${value.substring(0, 50)}...` : value,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackShareAttempt = useCallback((method: 'whatsapp' | 'copy_link' | 'social', page: string) => {
    trackEvent('share_attempted', {
      share_method: method,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackAgeRange = useCallback((birthDate: string, page: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    
    let ageRange = '';
    if (age < 18) ageRange = 'menor_18';
    else if (age <= 25) ageRange = '18_25';
    else if (age <= 35) ageRange = '26_35';
    else if (age <= 45) ageRange = '36_45';
    else ageRange = 'acima_45';

    trackEvent('age_range_identified', {
      age_range: ageRange,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackCEPSearch = useCallback((cep: string, resultsFound: number, page: string) => {
    trackEvent('cep_searched', {
      cep_region: cep.substring(0, 2), // Apenas os 2 primeiros dígitos por privacidade
      results_found: resultsFound,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackPaymentMethod = useCallback((method: 'pix' | 'credit_card' | 'bank_slip', amount: number) => {
    trackEvent('payment_method_selected', {
      payment_method: method,
      amount,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackDropoff = useCallback((page: string, timeOnPage: number, lastAction: string) => {
    trackEvent('page_dropoff', {
      page,
      time_on_page_seconds: timeOnPage,
      last_action: lastAction,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackSuccessfulSubmission = useCallback((page: string, formData: Record<string, any>) => {
    trackEvent('form_submission_success', {
      page,
      form_fields_count: Object.keys(formData).length,
      has_cpf: !!formData.cpf,
      has_email: !!formData.email,
      has_phone: !!formData.telefone,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackMillitaryInterest = useCallback((interest: string, experience: string, page: string) => {
    trackEvent('military_interest_declared', {
      interest_level: interest,
      previous_experience: experience,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackLocationPermission = useCallback((granted: boolean, page: string) => {
    trackEvent('location_permission', {
      permission_granted: granted,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackDocumentUpload = useCallback((documentType: string, success: boolean, page: string) => {
    trackEvent('document_uploaded', {
      document_type: documentType,
      upload_success: success,
      page,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackReturnVisit = useCallback((page: string, daysSinceLastVisit: number) => {
    trackEvent('return_visit', {
      page,
      days_since_last_visit: daysSinceLastVisit,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackSharingBehavior = useCallback((action: string, context: string, platform?: string) => {
    trackEvent('sharing_behavior', {
      action,
      context,
      platform,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackGenderSelection,
    trackPixCodeCopy,
    trackPixQRCodeView,
    trackFormFieldCompleted,
    trackShareAttempt,
    trackAgeRange,
    trackCEPSearch,
    trackPaymentMethod,
    trackDropoff,
    trackSuccessfulSubmission,
    trackMillitaryInterest,
    trackLocationPermission,
    trackDocumentUpload,
    trackReturnVisit,
    trackSharingBehavior
  };
};