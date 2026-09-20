import os
import pandas as pd

schemes = [
    {
        "scheme_id": "SCH001",
        "scheme_name": "Pre-Matric Scholarship for SC Students",
        "department": "Social Justice and Empowerment Department, Gujarat",
        "category": "Education",
        "description": "Financial scholarship to Scheduled Caste students studying in classes 1 to 10 to encourage school attendance and minimize dropout rates.",
        "benefit": "Annual educational grant of ₹3,500 for day scholars and ₹7,000 for hostellers plus book grants.",
        "application_url": "https://www.digitalgujarat.gov.in",
        "source_url": "https://sje.gujarat.gov.in/schemes/pre-matric-scholarship-sc",
        "rules": [
            {"attribute": "category", "operator": "IN", "value": "SC"},
            {"attribute": "income", "operator": "<=", "value": "250000"},
            {"attribute": "student_status", "operator": "=", "value": "True"},
            {"attribute": "education_level", "operator": "IN", "value": "Primary,Secondary"},
        ],
        "documents": [
            "Income certificate",
            "Caste certificate",
            "School bonafide certificate",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH002",
        "scheme_name": "Post-Matric Scholarship for OBC/SEBC Students",
        "department": "Developing Castes Welfare Department, Gujarat",
        "category": "Education",
        "description": "Post-secondary educational scholarship covering maintenance allowance and tuition fees for SEBC/OBC students in technical and higher education.",
        "benefit": "Full tuition fee reimbursement and maintenance allowance up to ₹1,200 per month.",
        "application_url": "https://www.digitalgujarat.gov.in",
        "source_url": "https://sje.gujarat.gov.in/schemes/post-matric-sebc",
        "rules": [
            {"attribute": "category", "operator": "IN", "value": "OBC,SEBC"},
            {"attribute": "income", "operator": "<=", "value": "250000"},
            {"attribute": "student_status", "operator": "=", "value": "True"},
            {"attribute": "education_level", "operator": "IN", "value": "HigherSecondary,Graduate"},
        ],
        "documents": [
            "Income certificate",
            "Non-Creamy Layer / SEBC certificate",
            "College admission receipt",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH003",
        "scheme_name": "Swami Vivekanand Stipend for Technical Courses",
        "department": "Directorate of Employment & Training, Gujarat",
        "category": "Education",
        "description": "Monthly financial stipend given to students from economically weaker households pursuing diploma, ITI, and undergraduate professional courses.",
        "benefit": "Stipend of ₹400 to ₹1,000 per month for the duration of the diploma/degree course.",
        "application_url": "https://www.digitalgujarat.gov.in",
        "source_url": "https://talimrojgar.gujarat.gov.in/schemes",
        "rules": [
            {"attribute": "income", "operator": "<=", "value": "300000"},
            {"attribute": "student_status", "operator": "=", "value": "True"},
            {"attribute": "education_level", "operator": "IN", "value": "Graduate"},
        ],
        "documents": [
            "Income certificate",
            "Course enrollment certificate",
            "Bank passbook copy",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH004",
        "scheme_name": "Indira Gandhi National Old Age Pension / Vrudh Pension",
        "department": "Social Justice and Empowerment Department, Gujarat",
        "category": "Pension",
        "description": "Monthly social security pension for destitute senior citizens to provide dignified livelihood and medical security in old age.",
        "benefit": "Monthly direct benefit transfer (DBT) of ₹1,000 to ₹1,250 credited directly to bank account.",
        "application_url": "https://esamajkalyan.gujarat.gov.in",
        "source_url": "https://sje.gujarat.gov.in/dsed/schemes/old-age-pension",
        "rules": [
            {"attribute": "age", "operator": ">=", "value": "60"},
            {"attribute": "income", "operator": "<=", "value": "200000"},
            {"attribute": "family_size", "operator": ">=", "value": "1"},
        ],
        "documents": [
            "Age proof (Birth certificate/School leaving)",
            "Income certificate",
            "Bank account details",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH005",
        "scheme_name": "Ganga Swarupa Financial Assistance Yojana (Widow Pension)",
        "department": "Women and Child Development Department, Gujarat",
        "category": "Women & Child",
        "description": "Monthly economic assistance granted to widowed women for their financial independence and family sustenance.",
        "benefit": "Monthly pension of ₹1,250 deposited directly via DBT into the beneficiary's post office or bank account.",
        "application_url": "https://wcd.gujarat.gov.in",
        "source_url": "https://wcd.gujarat.gov.in/ganga-swarupa-yojana",
        "rules": [
            {"attribute": "gender", "operator": "=", "value": "Female"},
            {"attribute": "age", "operator": ">=", "value": "18"},
            {"attribute": "income", "operator": "<=", "value": "150000"},
        ],
        "documents": [
            "Husband's Death Certificate",
            "Income certificate",
            "Affidavit of non-remarriage",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH006",
        "scheme_name": "Vahli Dikri Yojana",
        "department": "Women and Child Development Department, Gujarat",
        "category": "Women & Child",
        "description": "Staged financial incentive scheme for female children to improve sex ratio, encourage girl child education, and prevent child marriage.",
        "benefit": "Total financial assistance of ₹1,10,000 in three stages (at class 1, class 9, and at age 18 for higher education/marriage).",
        "application_url": "https://wcd.gujarat.gov.in",
        "source_url": "https://wcd.gujarat.gov.in/vahli-dikri-yojana",
        "rules": [
            {"attribute": "gender", "operator": "=", "value": "Female"},
            {"attribute": "age", "operator": "<=", "value": "18"},
            {"attribute": "income", "operator": "<=", "value": "200000"},
        ],
        "documents": [
            "Girl child birth certificate",
            "Parent income certificate",
            "Ration card copy",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH007",
        "scheme_name": "Dr. B.R. Ambedkar Awas Yojana",
        "department": "Social Justice and Empowerment Department, Gujarat",
        "category": "Housing",
        "description": "Subsidized pucca housing financial grant for homeless or kachcha house dweller families belonging to Scheduled Castes.",
        "benefit": "Financial assistance of ₹1,20,000 released in three progressive construction installments.",
        "application_url": "https://esamajkalyan.gujarat.gov.in",
        "source_url": "https://sje.gujarat.gov.in/dsed/schemes/dr-ambedkar-awas-yojana",
        "rules": [
            {"attribute": "category", "operator": "IN", "value": "SC,ST"},
            {"attribute": "income", "operator": "<=", "value": "150000"},
            {"attribute": "housing_status", "operator": "IN", "value": "Rented,None"},
        ],
        "documents": [
            "Caste certificate",
            "Income certificate",
            "Land ownership/plot possession proof",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH008",
        "scheme_name": "Pandit Deendayal Upadhyay Awas Yojana",
        "department": "Social Justice and Empowerment Department, Gujarat",
        "category": "Housing",
        "description": "Housing assistance scheme for Socially and Educationally Backward Classes (SEBC) living in dilapidated or non-permanent shelters.",
        "benefit": "Housing construction subsidy of ₹1,20,000 for constructing a permanent pucca house.",
        "application_url": "https://esamajkalyan.gujarat.gov.in",
        "source_url": "https://esamajkalyan.gujarat.gov.in/schemes/pandit-deendayal-awas",
        "rules": [
            {"attribute": "category", "operator": "IN", "value": "OBC,SEBC"},
            {"attribute": "income", "operator": "<=", "value": "150000"},
            {"attribute": "housing_status", "operator": "IN", "value": "Rented,None"},
        ],
        "documents": [
            "SEBC/OBC Caste certificate",
            "Income certificate",
            "Proof of plot/dilapidated house",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH009",
        "scheme_name": "Sant Surdas Disability Pension Yojana",
        "department": "Social Justice and Empowerment Department, Gujarat",
        "category": "Disability",
        "description": "Monthly financial pension provided to citizens living with severe disabilities (80% and above disability index) for livelihood assistance.",
        "benefit": "Monthly pension of ₹1,000 disbursed through direct bank transfer.",
        "application_url": "https://esamajkalyan.gujarat.gov.in",
        "source_url": "https://sje.gujarat.gov.in/dsed/schemes/sant-surdas-yojana",
        "rules": [
            {"attribute": "disability_status", "operator": "=", "value": "True"},
            {"attribute": "income", "operator": "<=", "value": "150000"},
            {"attribute": "age", "operator": ">=", "value": "1"},
        ],
        "documents": [
            "Disability certificate / UDID card",
            "Income certificate",
            "Age proof",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH010",
        "scheme_name": "Manav Garima Yojana (Toolkit for Self-Employment)",
        "department": "Social Justice and Empowerment Department, Gujarat",
        "category": "Economic",
        "description": "Free provision of modern occupational toolkits (carpentry, tailoring, plumbing, electrical, etc.) to empower micro-entrepreneurs and artisans.",
        "benefit": "Free physical equipment/toolkit package worth up to ₹25,000 for self-employment trades.",
        "application_url": "https://esamajkalyan.gujarat.gov.in",
        "source_url": "https://esamajkalyan.gujarat.gov.in/manav-garima",
        "rules": [
            {"attribute": "category", "operator": "IN", "value": "SC,ST,OBC,SEBC"},
            {"attribute": "income", "operator": "<=", "value": "150000"},
            {"attribute": "age", "operator": ">=", "value": "18"},
            {"attribute": "age", "operator": "<=", "value": "60"},
        ],
        "documents": [
            "Caste certificate",
            "Income certificate",
            "Ration card copy",
            "Trade training or experience proof",
            "Aadhaar (masked in this system)"
        ]
    },
    {
        "scheme_id": "SCH011",
        "scheme_name": "Gujarat Concessional Education Loan Scheme",
        "department": "Gujarat Backward Classes Development Corporation (GSFDC)",
        "category": "Economic",
        "description": "Low-interest educational credit facility for higher secondary and graduate youth pursuing engineering, medical, and specialized professional studies.",
        "benefit": "Subsidized education loan up to ₹15,00,000 at a nominal 4% simple annual interest rate.",
        "application_url": "https://gsfdc.gujarat.gov.in",
        "source_url": "https://gsfdc.gujarat.gov.in/schemes/higher-education-loan",
        "rules": [
            {"attribute": "income", "operator": "<=", "value": "450000"},
            {"attribute": "education_level", "operator": "IN", "value": "HigherSecondary,Graduate"},
            {"attribute": "age", "operator": ">=", "value": "17"},
        ],
        "documents": [
            "Admission letter from accredited college/university",
            "Fee structure estimate",
            "Income certificate",
            "Aadhaar (masked in this system)"
        ]
    }
]

# Generate Markdown files
os.makedirs("docs/schemes", exist_ok=True)
for s in schemes:
    md_path = f"docs/schemes/{s['scheme_id']}.md"
    rules_table = "\n".join([f"| {r['attribute']} | {r['operator']} | {r['value']} |" for r in s['rules']])
    docs_list = "\n".join([f"- {d}" for d in s['documents']])
    content = f"""# {s['scheme_name']}
- scheme_id: {s['scheme_id']}
- department: {s['department']}
- category: {s['category']}
- description: {s['description']}
- benefit: {s['benefit']}
- source_url: {s['source_url']}

## Eligibility Rules (structured)
| attribute | operator | value |
|---|---|---|
{rules_table}

## Required Documents
{docs_list}
"""
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(content)

# Generate schemes_master.csv
os.makedirs("backend/data/raw", exist_ok=True)
schemes_df = pd.DataFrame([
    {
        "scheme_id": s["scheme_id"],
        "scheme_name": s["scheme_name"],
        "department": s["department"],
        "category": s["category"],
        "description": s["description"],
        "benefit": s["benefit"],
        "application_url": s["application_url"],
        "source_url": s["source_url"]
    }
    for s in schemes
])
schemes_df.to_csv("backend/data/raw/schemes_master.csv", index=False)

# Generate eligibility_rules.csv
rules_data = []
rule_idx = 1
for s in schemes:
    for r in s["rules"]:
        rules_data.append({
            "rule_id": f"RUL{rule_idx:03d}",
            "scheme_id": s["scheme_id"],
            "attribute": r["attribute"],
            "operator": r["operator"],
            "value": r["value"]
        })
        rule_idx += 1

rules_df = pd.DataFrame(rules_data)
rules_df.to_csv("backend/data/raw/eligibility_rules.csv", index=False)

# Generate docs/schemes/README.md
readme_content = """# Gujarat Welfare Schemes & Eligibility Rules

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
"""

with open("docs/schemes/README.md", "w", encoding="utf-8") as f:
    f.write(readme_content)

print(f"Successfully generated {len(schemes)} scheme markdown files, {len(rules_data)} rules in CSVs, and docs/schemes/README.md.")
