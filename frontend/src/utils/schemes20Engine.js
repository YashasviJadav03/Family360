/**
 * Gujarat Family ID Copilot — 20 Declarative Welfare Schemes Engine
 * Encodes 20 flagship state (Gujarat) and national (GoI) welfare programs
 * into deterministic, dual-scope predicates (Household vs Individual Member).
 */

export const SCHEMES_20 = [
  {
    id: 'SCH_NFBS',
    name: 'National Family Benefit Scheme (NFBS)',
    nameGu: 'રાષ્ટ્રીય કુટુંબ સહાય યોજના (NFBS)',
    nameHi: 'राष्ट्रीय परिवार सहायता योजना (NFBS)',
    domain: 'Social Security',
    scope: 'family',
    benefit: '₹20,000 one-time bereavement grant',
    monthlyValue: 1666, // amortized
    nodalCenter: 'Taluka Mamlatdar / Social Welfare Office',
    digitalPortal: 'Digital Gujarat (digitalgujarat.gov.in)',
    documents: ['Death Certificate of Breadwinner', 'BPL / Income Certificate', 'Bank Passbook', 'Family ID'],
    predicate: (family, members) => {
      const isLowIncome = (family.annual_income || 0) <= 100000;
      const hasDeceasedBreadwinner = members.some((m) => m.is_deceased && m.relation_to_head === 'Head');
      return isLowIncome && hasDeceasedBreadwinner;
    }
  },
  {
    id: 'SCH_VRIDH',
    name: 'Vridh Sahay (Old-Age Pension / Vrudh Pension)',
    nameGu: 'વૃદ્ધ સહાય યોજના (વૃદ્ધ પેન્શન)',
    nameHi: 'वृद्ध सहाय योजना (वृद्धावस्था पेंशन)',
    domain: 'Senior Welfare',
    scope: 'member',
    benefit: '₹1,000–₹1,250 monthly pension credited via DBT',
    monthlyValue: 1250,
    nodalCenter: 'District Social Welfare Office / Jan Seva Kendra',
    digitalPortal: 'e-Samaj Kalyan (esamajkalyan.gujarat.gov.in)',
    documents: ['Age Proof / Birth Certificate', 'Income Certificate (< ₹1.5L)', 'Aadhaar Card', 'Bank Account'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const age = member.age ?? calculateMemberAge(member.dob);
      const isLowIncome = (family.annual_income || 0) <= 150000;
      return age >= 60 && isLowIncome;
    }
  },
  {
    id: 'SCH_GANGA_SWAROOPA',
    name: 'Ganga Swaroopa Financial Assistance (Widow Pension)',
    nameGu: 'ગંગા સ્વરૂપા આર્થિક સહાય યોજના (વિધવા સહાય)',
    nameHi: 'गंगा स्वरूपा आर्थिक सहायता योजना (विधवा पेंशन)',
    domain: 'Women Empowerment',
    scope: 'member',
    benefit: '₹1,250 monthly direct benefit transfer pension',
    monthlyValue: 1250,
    nodalCenter: 'Taluka Prant Officer / Women & Child Development Office',
    digitalPortal: 'WCD Gujarat Portal (wcd.gujarat.gov.in)',
    documents: ['Husband Death Certificate', 'Widow Affidavit', 'Income Certificate (< ₹1.5L)', 'Aadhaar Card'],
    predicate: (family, member, allMembers) => {
      if (!member || member.is_deceased) return false;
      const isFemale = (member.gender || '').toLowerCase() === 'female';
      const isWidowed = member.marital_status === 'Widowed' || member.is_widowed === true;
      const isLowIncome = (family.annual_income || 0) <= 150000;
      // No adult son condition (or adult son earning >= living threshold)
      const hasAdultSon = (allMembers || []).some((m) => 
        !m.is_deceased && (m.relation_to_head || '').toLowerCase() === 'son' && (m.age ?? calculateMemberAge(m.dob)) >= 21
      );
      return isFemale && isWidowed && isLowIncome && !hasAdultSon;
    }
  },
  {
    id: 'SCH_DISABILITY_PENSION',
    name: 'Gujarat Disability Pension (Sant Surdas Yojana)',
    nameGu: 'સંત સૂરદાસ દિવ્યાંગ પેન્શન યોજના',
    nameHi: 'संत सूरदास दिव्यांग पेंशन योजना',
    domain: 'Special Needs',
    scope: 'member',
    benefit: '₹1,000–₹1,250 monthly specialized disability pension',
    monthlyValue: 1000,
    nodalCenter: 'District Social Security Office / Civil Hospital Disability Board',
    digitalPortal: 'e-Samaj Kalyan (esamajkalyan.gujarat.gov.in)',
    documents: ['UDID Card / Disability Certificate (60%+)', 'BPL or Low Income Certificate', 'Aadhaar Card'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const hasDisability = member.disability_status === true || (member.disability_percentage || 0) >= 60;
      const isLowIncome = (family.annual_income || 0) <= 150000;
      return hasDisability && isLowIncome;
    }
  },
  {
    id: 'SCH_POST_MATRIC_SC',
    name: 'Post-Matric Scholarship for SC Students',
    nameGu: 'અનુસૂચિત જાતિ પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ',
    nameHi: 'अनुसूचित जाति पोस्ट-मैट्रिक छात्रवृत्ति',
    domain: 'Higher Education',
    scope: 'member',
    benefit: '100% tuition reimbursement + ₹1,200/month maintenance',
    monthlyValue: 1200,
    nodalCenter: 'District Developing Castes Welfare Office / College Helpdesk',
    digitalPortal: 'Digital Gujarat (digitalgujarat.gov.in)',
    documents: ['SC Caste Certificate', 'College Fee Receipt & Admission Bonafide', 'Income Certificate (< ₹2.5L)'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isSC = (family.social_category || '').toUpperCase() === 'SC';
      const age = member.age ?? calculateMemberAge(member.dob);
      const isHigherStudent = member.student_status === true && (['HigherSecondary', 'Graduate', 'PostGraduate'].includes(member.education_level) || (age >= 17 && age <= 30));
      const incomeOk = (family.annual_income || 0) <= 250000;
      return isSC && isHigherStudent && incomeOk;
    }
  },
  {
    id: 'SCH_POST_MATRIC_ST',
    name: 'Post-Matric Scholarship for ST Students',
    nameGu: 'અનુસૂચિત જનજાતિ પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ',
    nameHi: 'अनुसूचित जनजाति पोस्ट-मैट्रिक छात्रवृत्ति',
    domain: 'Higher Education',
    scope: 'member',
    benefit: 'Full course fee waiver + living maintenance grant',
    monthlyValue: 1200,
    nodalCenter: 'Tribal Development Department / ITDP Project Office',
    digitalPortal: 'Digital Gujarat (digitalgujarat.gov.in)',
    documents: ['ST Tribe Certificate', 'College Admission Proof', 'Income Certificate (< ₹2.5L)'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isST = (family.social_category || '').toUpperCase() === 'ST';
      const age = member.age ?? calculateMemberAge(member.dob);
      const isHigherStudent = member.student_status === true && (['HigherSecondary', 'Graduate'].includes(member.education_level) || (age >= 17 && age <= 30));
      const incomeOk = (family.annual_income || 0) <= 250000;
      return isST && isHigherStudent && incomeOk;
    }
  },
  {
    id: 'SCH_POST_MATRIC_OBC',
    name: 'Post-Matric Scholarship for OBC/SEBC Students',
    nameGu: 'ઓબીસી/એસઈબીસી પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ',
    nameHi: 'ओबीसी/एसईबीसी पोस्ट-मैट्रिक छात्रवृत्ति',
    domain: 'Higher Education',
    scope: 'member',
    benefit: 'Tuition grant + ₹800–₹1,000 monthly maintenance',
    monthlyValue: 900,
    nodalCenter: 'Developing Castes Welfare Directorate / District Center',
    digitalPortal: 'Digital Gujarat (digitalgujarat.gov.in)',
    documents: ['SEBC/OBC Certificate', 'Non-Creamy Layer (NCL) Certificate', 'Fee Receipt'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isOBC = ['OBC', 'SEBC'].includes((family.social_category || '').toUpperCase());
      const age = member.age ?? calculateMemberAge(member.dob);
      const isHigherStudent = member.student_status === true && (age >= 17 && age <= 28);
      const incomeOk = (family.annual_income || 0) <= 150000;
      return isOBC && isHigherStudent && incomeOk;
    }
  },
  {
    id: 'SCH_VAHLI_DIKRI',
    name: 'Vahli Dikri Yojana (Girl Child Welfare Bond)',
    nameGu: 'વ્હાલી દીકરી યોજના (કન્યા કલ્યાણ સહાય)',
    nameHi: 'व्हाली डिकरी योजना (बालिका कल्याण बांड)',
    domain: 'Girl Child Welfare',
    scope: 'member',
    benefit: '₹1,10,000 staggered bond (Class 1, 9, and age 18 graduation)',
    monthlyValue: 1500, // effective value
    nodalCenter: 'Anganwadi Center / CDPO Child Development Project Office',
    digitalPortal: 'Women & Child Development (wcd.gujarat.gov.in)',
    documents: ['Daughter Birth Certificate', 'Mata-Pita Family ID', 'Income Certificate (≤ ₹2,00,000)', 'Bank Passbook'],
    predicate: (family, member, allMembers) => {
      if (!member || member.is_deceased) return false;
      const isFemale = (member.gender || '').toLowerCase() === 'female';
      const age = member.age ?? calculateMemberAge(member.dob);
      const isDaughter = ['daughter', 'child'].includes((member.relation_to_head || '').toLowerCase()) || age <= 18;
      const daughtersCount = (allMembers || []).filter(
        (m) => !m.is_deceased && (m.gender || '').toLowerCase() === 'female' && (['daughter', 'child'].includes((m.relation_to_head || '').toLowerCase()) || (m.age ?? calculateMemberAge(m.dob)) <= 18)
      ).length;
      const incomeOk = (family.annual_income || 0) <= 200000;
      return isFemale && isDaughter && daughtersCount <= 2 && incomeOk;
    }
  },
  {
    id: 'SCH_PMAY_EWS',
    name: 'PMAY Housing Subsidy (EWS Affordable Shelter)',
    nameGu: 'પ્રધાનમંત્રી આવાસ યોજના (EWS પાકું મકાન સહાય)',
    nameHi: 'प्रधानमंत्री आवास योजना (EWS पक्का मकान सहायता)',
    domain: 'Shelter & Housing',
    scope: 'family',
    benefit: 'Up to ₹2,67,000 construction grant / interest subvention',
    monthlyValue: 2500,
    nodalCenter: 'Taluka Development Office (TDO) / Urban Development Authority',
    digitalPortal: 'PMAY-MIS (pmaymis.gov.in) & e-Gram Center',
    documents: ['Kutcha House Proof / Photograph', 'Land Title / NOC', 'Income Certificate (≤ ₹3.0L)'],
    predicate: (family) => {
      const isKutchaOrRented = ['Rented', 'Kutcha', 'None', 'dilapidated'].includes(family.housing_status) || !family.housing_status || family.housing_status !== 'Pucca';
      const incomeOk = (family.annual_income || 0) <= 300000;
      return isKutchaOrRented && incomeOk;
    }
  },
  {
    id: 'SCH_PMAY_LIG',
    name: 'PMAY Housing Subsidy (LIG Middle Housing)',
    nameGu: 'પ્રધાનમંત્રી આવાસ યોજના (LIG આવાસ સબસિડી)',
    nameHi: 'प्रधानमंत्री आवास योजना (LIG आवास सब्सिडी)',
    domain: 'Shelter & Housing',
    scope: 'family',
    benefit: 'Up to ₹2,35,000 credit-linked housing loan subsidy',
    monthlyValue: 1800,
    nodalCenter: 'Municipal Corporation / Lead Bank District Office',
    digitalPortal: 'PMAY Housing Portal',
    documents: ['Housing Application', 'Income Proof (₹3.0L – ₹6.0L)', 'Property Registration Deed'],
    predicate: (family) => {
      const income = family.annual_income || 0;
      const incomeOk = income > 300000 && income <= 600000;
      return incomeOk;
    }
  },
  {
    id: 'SCH_JANANI_SURAKSHA',
    name: 'Janani Suraksha Yojana (Maternal Healthcare Cash Aid)',
    nameGu: 'જનની સુરક્ષા યોજના (માતૃત્વ આરોગ્ય આર્થિક સહાય)',
    nameHi: 'जननी सुरक्षा योजना (मातृत्व स्वास्थ्य नकद सहायता)',
    domain: 'Maternal Healthcare',
    scope: 'member',
    benefit: '₹700 (rural) / ₹600 (urban) institutional delivery support',
    monthlyValue: 600,
    nodalCenter: 'Primary Health Center (PHC) / Community Health Center (CHC) / ASHA Worker',
    digitalPortal: 'Health & Family Welfare (gujhealth.gujarat.gov.in)',
    documents: ['Mamta Card (MCP Card)', 'Institutional Delivery Slip', 'Aadhaar Card'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isFemale = (member.gender || '').toLowerCase() === 'female';
      const age = member.age ?? calculateMemberAge(member.dob);
      const isPregnant = member.is_pregnant === true || member.maternal_status === 'Pregnant';
      const isBPLorReserved = (family.annual_income || 0) <= 150000 || ['SC', 'ST', 'OBC'].includes((family.social_category || '').toUpperCase());
      return isFemale && age >= 18 && age <= 45 && isPregnant && isBPLorReserved;
    }
  },
  {
    id: 'SCH_PMKVY_SKILL',
    name: 'PMKVY Youth Skill Development & Apprenticeship',
    nameGu: 'પ્રધાનમંત્રી કૌશલ્ય વિકાસ યોજના (PMKVY ૨.૦)',
    nameHi: 'प्रधानमंत्री कौशल विकास योजना (PMKVY 2.0)',
    domain: 'Youth Employment',
    scope: 'member',
    benefit: 'Free NSQF certification training + ₹8,000 post-course stipend',
    monthlyValue: 800,
    nodalCenter: 'District Employment Exchange / Pradhan Mantri Kaushal Kendra (PMKK)',
    digitalPortal: 'Skill India Digital (skillindiadigital.gov.in)',
    documents: ['10th/12th Marksheet or School Leaving', 'Aadhaar Card', 'Bank Account Details'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const age = member.age ?? calculateMemberAge(member.dob);
      const isYouth = age >= 15 && age <= 40;
      const isEligibleWorkforce = member.occupation === 'Unemployed' || member.occupation === 'Student' || !member.occupation || member.occupation === 'Laborer';
      return isYouth && isEligibleWorkforce;
    }
  },
  {
    id: 'SCH_AAY_RATION',
    name: 'Antyodaya Anna Yojana (AAY Ultra-Poor Foodgrain)',
    nameGu: 'અંત્યોદય અન્ન યોજના (AAY વિનામૂલ્યે અનાજ ક્વોટા)',
    nameHi: 'अंत्योदय अन्न योजना (AAY अनाज कोटा)',
    domain: 'Food Security / PDS',
    scope: 'family',
    benefit: 'Fixed 35 kg foodgrain basket per household (wheat ₹2/kg, rice ₹3/kg)',
    monthlyValue: 1050, // market price diff
    nodalCenter: 'Fair Price Shop (FPS) / Taluka Supply Officer (Mamlatdar)',
    digitalPortal: 'Food & Civil Supplies (ipds.gujarat.gov.in)',
    documents: ['AAY Yellow Ration Card', 'Family ID Smart Card', 'Income Certificate (≤ ₹15,000)'],
    predicate: (family) => {
      const income = family.annual_income || 0;
      return income <= 25000; // ultra poverty line
    }
  },
  {
    id: 'SCH_PHH_RATION',
    name: 'Priority Household (PHH) Subsidized NFSA Ration',
    nameGu: 'અગ્રતા ધરાવતા કુટુંબો (PHH) અન્ન સુરક્ષા ક્વોટા',
    nameHi: 'प्राथमिकता परिवार (PHH) राष्ट्रीय खाद्य सुरक्षा कोटा',
    domain: 'Food Security / PDS',
    scope: 'family',
    benefit: '5 kg foodgrain per member monthly (3 kg wheat, 1.5 kg rice, 0.5 kg coarse)',
    monthlyValue: 400, // per member effective
    nodalCenter: 'Fair Price Shop (Pandit Deendayal Grahak Bhandar)',
    digitalPortal: 'Gujarat PDS Portal',
    documents: ['Barcoded Ration Card', 'Aadhaar-Seeded Family Members'],
    predicate: (family) => {
      const income = family.annual_income || 0;
      return income > 25000 && income <= 120000;
    }
  },
  {
    id: 'SCH_PRE_MATRIC_SCST',
    name: 'Pre-Matric Educational Scholarship (SC/ST Classes 1–10)',
    nameGu: 'અનુસૂચિત જાતિ/જનજાતિ પ્રી-મેટ્રિક શિષ્યવૃત્તિ',
    nameHi: 'अनुसूचित जाति/जनजाति प्री-मैट्रिक छात्रवृत्ति',
    domain: 'School Education',
    scope: 'member',
    benefit: '₹3,500 day-scholar / ₹7,000 hosteller annual book & uniform grant',
    monthlyValue: 450,
    nodalCenter: 'Government Primary / Secondary School Principal Desk',
    digitalPortal: 'Digital Gujarat & Vidya Samiksha Kendra',
    documents: ['School Bonafide Certificate', 'Caste Certificate', 'Family Income Certificate'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isSCST = ['SC', 'ST'].includes((family.social_category || '').toUpperCase());
      const age = member.age ?? calculateMemberAge(member.dob);
      const isSchoolStudent = (age >= 6 && age <= 16) && (member.student_status === true || ['Primary', 'Secondary'].includes(member.education_level));
      const incomeOk = (family.annual_income || 0) <= 200000;
      return isSCST && isSchoolStudent && incomeOk;
    }
  },
  {
    id: 'SCH_MANAV_GARIMA',
    name: 'Manav Garima Yojana (Free Self-Employment Toolkit)',
    nameGu: 'માનવ ગરિમા યોજના (સ્વરોજગાર સાધન કીટ સહાય)',
    nameHi: 'मानव गरिमा योजना (स्वरोजगार टूलकिट सहायता)',
    domain: 'Micro-Livelihood',
    scope: 'member',
    benefit: 'Free physical toolkit/machinery worth up to ₹25,000 for 28 trades',
    monthlyValue: 2000,
    nodalCenter: 'District Social Justice Officer / e-Samaj Kalyan Helpdesk',
    digitalPortal: 'e-Samaj Kalyan (esamajkalyan.gujarat.gov.in)',
    documents: ['Caste Certificate (SC/ST/OBC)', 'Ration Card', 'Trade Experience Certificate', 'Income Certificate (< ₹1.5L)'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isReserved = ['SC', 'ST', 'OBC', 'SEBC'].includes((family.social_category || '').toUpperCase());
      const age = member.age ?? calculateMemberAge(member.dob);
      const isWorkingAge = age >= 18 && age <= 60;
      const isLowIncome = (family.annual_income || 0) <= 150000;
      return isReserved && isWorkingAge && isLowIncome;
    }
  },
  {
    id: 'SCH_PALAK_MATA_PITA',
    name: 'Palak Mata Pita Yojana (Foster Care Support for Orphans)',
    nameGu: 'પાલક માતા-પિતા યોજના (અનાથ બાળકો માટે માસિક સહાય)',
    nameHi: 'पालक माता-पिता योजना (अनाथ बाल पालन-पोषण)',
    domain: 'Orphan Child Support',
    scope: 'member',
    benefit: '₹3,000 monthly direct bank transfer per foster child',
    monthlyValue: 3000,
    nodalCenter: 'District Child Protection Unit (DCPU) / Collectorate',
    digitalPortal: 'Social Defense Gujarat (sje.gujarat.gov.in)',
    documents: ['Biological Parents Death Certificates', 'Guardian Adoption/Foster Order', 'Income Certificate (≤ ₹1.2L)'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const age = member.age ?? calculateMemberAge(member.dob);
      const isMinor = age < 18;
      const isOrphan = member.is_orphan === true || member.relation_to_head === 'FosterChild';
      const incomeOk = (family.annual_income || 0) <= 120000;
      return isMinor && isOrphan && incomeOk;
    }
  },
  {
    id: 'SCH_KANYA_KELAVNI',
    name: 'Kanya Kelavni Mahotsav (Girl Student Retention Incentive)',
    nameGu: 'કન્યા કેળવણી પ્રોત્સાહન યોજના (શાળા પ્રવેશ ઉત્સવ)',
    nameHi: 'कन्या केलवणी प्रोत्साहन (बालिका शिक्षा अनुदान)',
    domain: 'Girl Child Retention',
    scope: 'member',
    benefit: '₹3,000–₹5,000 annual academic stipend and bicycle grant',
    monthlyValue: 400,
    nodalCenter: 'Taluka Primary Education Officer (TPEO) / School Desk',
    digitalPortal: 'Gujarat School Education Portal',
    documents: ['School Bonafide', 'Girl Child Birth Certificate', 'BPL Card'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isFemale = (member.gender || '').toLowerCase() === 'female';
      const age = member.age ?? calculateMemberAge(member.dob);
      const inSchool = age >= 6 && age <= 18 && member.student_status === true;
      const isLowIncome = (family.annual_income || 0) <= 150000;
      return isFemale && inSchool && isLowIncome;
    }
  },
  {
    id: 'SCH_IGNWPS_CENTRAL',
    name: 'Indira Gandhi National Widow Pension (IGNWPS)',
    nameGu: 'ઇન્દિરા ગાંધી રાષ્ટ્રીય વિધવા પેન્શન યોજના (કેન્દ્રીય)',
    nameHi: 'इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना (केंद्रीय)',
    domain: 'Central Social Security',
    scope: 'member',
    benefit: '₹300 central stipend + state top-up monthly pension',
    monthlyValue: 750,
    nodalCenter: 'Jan Seva Kendra / Taluka Panchayat Social Security Cell',
    digitalPortal: 'NSAP National Social Assistance Programme (nsap.nic.in)',
    documents: ['BPL Census Record 2002', 'Husband Death Certificate', 'Age Proof (40–79 yrs)'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const isFemale = (member.gender || '').toLowerCase() === 'female';
      const isWidowed = member.marital_status === 'Widowed' || member.is_widowed === true;
      const age = member.age ?? calculateMemberAge(member.dob);
      const isBPL = (family.annual_income || 0) <= 100000;
      return isFemale && isWidowed && age >= 40 && age <= 79 && isBPL;
    }
  },
  {
    id: 'SCH_IGNDPS_CENTRAL',
    name: 'Indira Gandhi National Disability Pension (IGNDPS)',
    nameGu: 'ઇન્દિરા ગાંધી રાષ્ટ્રીય દિવ્યાંગ પેન્શન યોજના (80%+ ગંભીર દિવ્યાંગ)',
    nameHi: 'इंदिरा गांधी राष्ट्रीय दिव्यांग पेंशन योजना (गंभीर दिव्यांग)',
    domain: 'Central Social Security',
    scope: 'member',
    benefit: '₹300 central grant + ₹700 state assistance DBT monthly',
    monthlyValue: 1000,
    nodalCenter: 'District Social Security Office / NSAP Cell',
    digitalPortal: 'NSAP Portal (nsap.nic.in)',
    documents: ['Severe Disability Certificate (80%+)', 'BPL Certificate', 'Aadhaar Card'],
    predicate: (family, member) => {
      if (!member || member.is_deceased) return false;
      const age = member.age ?? calculateMemberAge(member.dob);
      const isAdultOrSenior = age >= 18 && age <= 79;
      const isSevereDisability = (member.disability_percentage || 0) >= 80 || member.disability_status === true;
      const isBPL = (family.annual_income || 0) <= 100000;
      return isAdultOrSenior && isSevereDisability && isBPL;
    }
  }
];

export function calculateMemberAge(dobString) {
  if (!dobString) return 30;
  const birthDate = new Date(dobString);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.max(0, Math.abs(ageDate.getUTCFullYear() - 1970));
}

/**
 * Evaluate all 20 declarative welfare schemes against a family household state.
 */
export function evaluate20Schemes(family, members = []) {
  if (!family) return { qualified: [], totalAnnualValue: 0, monthlyFinancialSupport: 0 };

  const qualified = [];
  const aliveMembers = members.filter((m) => !m.is_deceased);

  SCHEMES_20.forEach((scheme) => {
    if (scheme.scope === 'family') {
      const isEligible = scheme.predicate(family, members);
      if (isEligible) {
        qualified.push({
          scheme,
          scope: 'family',
          beneficiaryName: `${family.family_id} (Household)`,
          beneficiaryMemberId: null,
          monthlyValue: scheme.monthlyValue,
          annualValue: scheme.monthlyValue * 12
        });
      }
    } else {
      // Member-level evaluation
      members.forEach((member) => {
        const isEligible = scheme.predicate(family, member, members);
        if (isEligible) {
          qualified.push({
            scheme,
            scope: 'member',
            beneficiaryName: member.name || member.member_id,
            beneficiaryMemberId: member.member_id,
            monthlyValue: scheme.monthlyValue,
            annualValue: scheme.monthlyValue * 12
          });
        }
      });
    }
  });

  const totalAnnualValue = qualified.reduce((sum, item) => sum + item.annualValue, 0);
  const monthlyFinancialSupport = qualified.reduce((sum, item) => sum + item.monthlyValue, 0);

  return {
    qualified,
    count: qualified.length,
    totalAnnualValue,
    monthlyFinancialSupport
  };
}

/**
 * Compute NFSA Monthly Foodgrain Allocation
 */
export function calculateNFSAQuota(family, members = []) {
  const aliveCount = (members.filter((m) => !m.is_deceased)).length || family.family_size || 4;
  const income = family.annual_income || 0;

  if (income <= 25000) {
    // Antyodaya Anna Yojana (AAY) - Flat 35 kg per family
    return {
      category: 'Antyodaya Anna Yojana (AAY)',
      cardColor: 'Yellow',
      wheatKg: 20,
      riceKg: 10,
      coarseKg: 5,
      totalKg: 35,
      rateWheat: '₹2.00 / kg',
      rateRice: '₹3.00 / kg',
      rateCoarse: '₹1.00 / kg',
      totalMonthlyCost: 75,
      openMarketValue: 1225,
      monthlySavings: 1150,
      badge: 'Ultra-Poor 35kg Basket'
    };
  } else if (income <= 120000) {
    // Priority Household (PHH) - 5 kg per member
    const totalWheat = aliveCount * 3;
    const totalRice = aliveCount * 1.5;
    const totalCoarse = aliveCount * 0.5;
    const totalKg = aliveCount * 5;
    return {
      category: 'Priority Household (PHH)',
      cardColor: 'Pink / Barcoded',
      wheatKg: totalWheat,
      riceKg: totalRice,
      coarseKg: totalCoarse,
      totalKg: totalKg,
      rateWheat: '₹2.00 / kg',
      rateRice: '₹3.00 / kg',
      rateCoarse: '₹1.00 / kg',
      totalMonthlyCost: totalWheat * 2 + totalRice * 3 + totalCoarse * 1,
      openMarketValue: totalKg * 35,
      monthlySavings: totalKg * 32,
      badge: `5 kg / Person (${totalKg} kg Total)`
    };
  } else {
    // Non-NFSA / APL Standard PDS
    return {
      category: 'Non-NFSA / Standard APL',
      cardColor: 'White / Blue',
      wheatKg: aliveCount * 2,
      riceKg: aliveCount * 1,
      coarseKg: 0,
      totalKg: aliveCount * 3,
      rateWheat: 'Market / Fair Price',
      rateRice: 'Market / Fair Price',
      rateCoarse: 'N/A',
      totalMonthlyCost: 150,
      openMarketValue: aliveCount * 105,
      monthlySavings: 150,
      badge: 'Universal PDS Subsidized Quota'
    };
  }
}
