# Gujarat Welfare Schemes & Eligibility Rules

This directory contains research-backed definitions of 11 real Gujarat welfare schemes across 6 key welfare domains:
- **Education**: Pre-Matric SC Scholarship, Post-Matric OBC/SEBC Scholarship, Swami Vivekanand Technical Stipend
- **Social Security / Pension**: Indira Gandhi National Old Age Pension (Vrudh Pension Yojana)
- **Women & Child**: Ganga Swarupa Yojana (Widow Pension), Vahli Dikri Yojana
- **Housing**: Dr. B.R. Ambedkar Awas Yojana (SC/ST), Pandit Deendayal Upadhyay Awas Yojana (SEBC/OBC)
- **Disability Assistance**: Sant Surdas Disability Pension Yojana
- **Economic / Self-Employment**: Manav Garima Yojana (Self-employment Toolkits), Gujarat Concessional Education Loan

## Source & Data Authenticity Notice
All scheme names, departments, and policy objectives are sourced directly from official Gujarat government portals:
- Social Justice and Empowerment Department (sje.gujarat.gov.in)
- Women and Child Development Department (wcd.gujarat.gov.in)
- e-Samaj Kalyan Portal (esamajkalyan.gujarat.gov.in)
- Digital Gujarat Portal (digitalgujarat.gov.in)
- Gujarat Safai Kamdar Vikas Nigam & GSFDC (gsfdc.gujarat.gov.in)

> **Verbal Disclosure for Hackathon & Demo**:
> *"The scheme definitions and eligibility attributes reflect real Gujarat welfare programs. Exact numeric thresholds (e.g., annual income ceilings, specific grant sums) are illustrative and based on publicly available department scheme guidelines as of 2024-2026. Production deployment will integrate directly with administrative rules supplied by the respective owning departments."*

## Rule Engine Attributes & Operators
All rules conform strictly to the standard evaluation schema:
- **Attributes**: `age`, `income`, `category`, `gender`, `education_level`, `student_status`, `disability_status`, `housing_status`, `district`, `family_size`
- **Operators**: `>=`, `<=`, `=`, `!=`, `IN`, `NOT_IN`, `>`, `<`
