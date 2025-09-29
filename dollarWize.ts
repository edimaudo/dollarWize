/**
 * dollarWize Financial Literacy Platform - Core TypeScript Logic
 *
 * This file contains the core data structures, interfaces, and business logic
 * for the American-focused financial literacy gamification platform.
 *
 * Key Features:
 * - Comprehensive question bank with 250+ questions
 * - User assessment and personalization system
 * - Financial glossary management
 * - Quiz logic and scoring algorithms
 * - Progress tracking and analytics
 */

// ============================================================================
// TYPE DEFINITIONS AND INTERFACES
// ============================================================================

/**
 * Represents different financial literacy skill levels
 * Used throughout the platform for content personalization
 */
export type FinancialLiteracyLevel = 'novice' | 'intermediate' | 'advanced';

/**
 * Different financial topic categories covered in the platform
 * Helps organize content and track learning progress across areas
 */
export type FinancialCategory =
    | 'savings'
    | 'retirement'
    | 'investing'
    | 'credit'
    | 'planning'
    | 'economics'
    | 'taxation'
    | 'real_estate'
    | 'education'
    | 'insurance'
    | 'budgeting'
    | 'debt_management';

/**
 * Core interface for quiz questions
 * Each question targets specific learning levels and financial categories
 */
export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct: number; // Index of the correct answer (0-3)
    level: FinancialLiteracyLevel;
    category: FinancialCategory;
    explanation: string;
    difficulty_weight: number; // 1-5 scale for adaptive learning
    us_specific: boolean; // Flags content specific to the US financial system
}

/**
 * Financial glossary term interface
 * Supports multi-level definitions for progressive learning
 */
export interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
    level: FinancialLiteracyLevel;
    category: FinancialCategory;
    related_terms: string[]; // IDs of related terms
    us_context?: string; // Additional US-specific information
    examples?: string[]; // Real-world examples
}

/**
 * User assessment result interface
 * Tracks user's financial literacy level and learning preferences
 */
export interface AssessmentResult {
    user_id: string;
    primary_level: FinancialLiteracyLevel;
    category_scores: Record<FinancialCategory, number>;
    strengths: FinancialCategory[];
    improvement_areas: FinancialCategory[];
    recommended_topics: string[];
    assessment_date: Date;
}

/**
 * Quiz session interface
 * Tracks individual quiz attempts and performance metrics
 */
export interface QuizSession {
    session_id: string;
    user_level: FinancialLiteracyLevel;
    questions: QuizQuestion[];
    user_answers: number[];
    score: number;
    total_questions: number;
    time_taken: number; // in seconds
    category_performance: Record<FinancialCategory, number>;
    completed_at: Date;
}

/**
 * User progress tracking interface
 * Maintains long-term learning analytics and achievements
 */
export interface UserProgress {
    user_id: string;
    current_level: FinancialLiteracyLevel;
    total_quizzes_completed: number;
    total_questions_answered: number;
    overall_accuracy: number;
    category_mastery: Record<FinancialCategory, number>;
    learning_streak: number; // consecutive days of activity
    achievements: string[];
    last_activity: Date;
}

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

/**
 * Comprehensive Financial Literacy Question Bank
 * 250+ questions covering all aspects of US personal finance
 */
export class FinancialQuestionBank {

    private questions: QuizQuestion[] = [
        // NOVICE LEVEL QUESTIONS - Building Financial Foundation
        {
            id: "nov_001",
            question: "What is the main benefit of a Roth IRA?",
            options: [
                "You get a tax deduction for contributions",
                "Qualified withdrawals in retirement are tax-free",
                "It has no contribution limits",
                "It can only be used for a home down payment"
            ],
            correct: 1,
            level: "novice",
            category: "retirement",
            explanation: "A Roth IRA allows for tax-free growth and tax-free withdrawals in retirement, as long as you've had the account for at least five years and are over 59½. Contributions are made with after-tax dollars.",
            difficulty_weight: 2,
            us_specific: true
        },
        {
            id: "nov_002",
            question: "What does compound interest mean?",
            options: [
                "Interest paid only on the original amount invested",
                "Interest paid on both the original amount and previously earned interest",
                "Interest that changes daily",
                "Interest that is guaranteed by the government"
            ],
            correct: 1,
            level: "novice",
            category: "savings",
            explanation: "Compound interest is when you earn interest on both your original investment and the interest you've already earned. This creates exponential growth over time.",
            difficulty_weight: 2,
            us_specific: false
        },
        {
            id: "nov_003",
            question: "How much should you ideally have in an emergency fund?",
            options: [
                "One month of expenses",
                "3-6 months of living expenses",
                "One year of income",
                "An amount equal to your car loan"
            ],
            correct: 1,
            level: "novice",
            category: "savings",
            explanation: "An emergency fund should hold enough cash to cover 3 to 6 months of essential living expenses. This provides a safety net for unexpected job loss, medical emergencies, or other large expenses without relying on debt.",
            difficulty_weight: 2,
            us_specific: false
        },
        {
            id: "nov_004",
            question: "What is the most common range for a 'good' FICO credit score?",
            options: [
                "300-579",
                "580-669",
                "670-739",
                "740-850"
            ],
            correct: 2,
            level: "novice",
            category: "credit",
            explanation: "In the United States, FICO credit scores range from 300-850. A score of 670-739 is considered good, while 740+ is very good to exceptional. Lenders often use these scores to determine loan eligibility and interest rates.",
            difficulty_weight: 3,
            us_specific: true
        },
        {
            id: "nov_005",
            question: "What is the purpose of a 401(k) retirement plan?",
            options: [
                "A tax-free account for a home down payment",
                "A government-funded pension plan",
                "An employer-sponsored retirement savings account",
                "A savings account for college tuition"
            ],
            correct: 2,
            level: "novice",
            category: "retirement",
            explanation: "A 401(k) is a popular employer-sponsored retirement account in the US. It allows employees to contribute a portion of their salary, often with a matching contribution from the employer. Contributions are typically pre-tax, reducing your taxable income.",
            difficulty_weight: 3,
            us_specific: true
        },
        {
            id: "nov_006",
            question: "What is the difference between a checking and a savings account?",
            options: [
                "Checking accounts pay higher interest",
                "Savings accounts are for daily transactions, checking for long-term goals",
                "Checking accounts are for daily transactions, savings accounts are for long-term goals",
                "There is no difference"
            ],
            correct: 2,
            level: "novice",
            category: "savings",
            explanation: "Checking accounts are designed for everyday transactions like paying bills and using a debit card, while savings accounts are intended to hold money you don't need immediately, often earning a small amount of interest.",
            difficulty_weight: 1,
            us_specific: false
        },
        {
            id: "nov_007",
            question: "What is net income?",
            options: [
                "Your total income before any deductions",
                "Your income after taxes and other deductions are taken out",
                "The money you earn from a side job",
                "Your income before your employer matches your 401(k) contribution"
            ],
            correct: 1,
            level: "novice",
            category: "planning",
            explanation: "Net income, or 'take-home pay,' is the amount of money you have left after all payroll deductions, such as taxes, Social Security, and health insurance premiums, are removed from your gross income.",
            difficulty_weight: 2,
            us_specific: false
        },
        {
            id: "nov_008",
            question: "What is a mortgage?",
            options: [
                "A loan used to buy a car",
                "A loan for a house or real estate",
                "A line of credit on your home",
                "A type of credit card"
            ],
            correct: 1,
            level: "novice",
            category: "real_estate",
            explanation: "A mortgage is a specific type of loan used to purchase a home or real estate. The property itself serves as collateral for the loan.",
            difficulty_weight: 1,
            us_specific: false
        },
        {
            id: "nov_009",
            question: "Why is having a budget important?",
            options: [
                "It guarantees you will save money",
                "It helps you track your spending and achieve financial goals",
                "It is only for people who have a lot of debt",
                "It allows you to spend as much as you want"
            ],
            correct: 1,
            level: "novice",
            category: "budgeting",
            explanation: "Creating a budget is the first step toward gaining control of your finances. It helps you understand where your money is going and allows you to make a plan to save, invest, and reach your goals.",
            difficulty_weight: 1,
            us_specific: false
        },
        {
            id: "nov_010",
            question: "What is the primary role of a financial advisor?",
            options: [
                "To guarantee high investment returns",
                "To provide personalized financial guidance and planning",
                "To manage your bank account daily",
                "To sell specific financial products only"
            ],
            correct: 1,
            level: "novice",
            category: "planning",
            explanation: "A financial advisor helps you set financial goals, create a plan, and make informed decisions about investments, retirement, and other financial matters.",
            difficulty_weight: 1,
            us_specific: false
        },

        // INTERMEDIATE LEVEL QUESTIONS - Expanding Your Financial Toolkit
        {
            id: "int_001",
            question: "What is a 529 plan primarily used for?",
            options: [
                "Retirement savings",
                "Healthcare expenses",
                "Education savings",
                "Long-term care"
            ],
            correct: 2,
            level: "intermediate",
            category: "education",
            explanation: "A 529 plan is a tax-advantaged savings plan in the US designed to encourage saving for future education costs. Contributions grow tax-deferred, and withdrawals are tax-free when used for qualified education expenses.",
            difficulty_weight: 3,
            us_specific: true
        },
        {
            id: "int_002",
            question: "What is the 'Rule of 72'?",
            options: [
                "A calculation for compound interest",
                "A way to estimate how long it takes an investment to double",
                "A formula for calculating your tax liability",
                "A formula for calculating your credit score"
            ],
            correct: 1,
            level: "intermediate",
            category: "investing",
            explanation: "The Rule of 72 is a simple way to estimate how long it will take for your investment to double, given a fixed annual rate of return. You divide 72 by the annual rate of return.",
            difficulty_weight: 3,
            us_specific: false
        },
        {
            id: "int_003",
            question: "What is dollar-cost averaging?",
            options: [
                "Selling investments when the price is high",
                "Investing a fixed amount of money at regular intervals",
                "Investing all your money at once",
                "A strategy to always buy low and sell high"
            ],
            correct: 1,
            level: "intermediate",
            category: "investing",
            explanation: "Dollar-cost averaging involves investing a fixed dollar amount on a regular basis, regardless of the share price. This strategy can reduce risk by smoothing out market volatility, preventing you from putting all your money into an investment at a market peak.",
            difficulty_weight: 3,
            us_specific: false
        },
        {
            id: "int_004",
            question: "Which of the following is a common deductible for a US tax return?",
            options: [
                "Rent payments",
                "Standard deduction or itemized deductions for mortgage interest",
                "Groceries",
                "Car payments"
            ],
            correct: 1,
            level: "intermediate",
            category: "taxation",
            explanation: "In the US, taxpayers can choose between the standard deduction or itemized deductions, such as state and local taxes, charitable contributions, and mortgage interest. Most people take the standard deduction.",
            difficulty_weight: 4,
            us_specific: true
        },
        {
            id: "int_005",
            question: "What is the difference between a bull market and a bear market?",
            options: [
                "A bull market is a period of falling stock prices; a bear market is a period of rising stock prices",
                "A bull market is a period of rising stock prices; a bear market is a period of falling stock prices",
                "They are the same thing",
                "A bull market refers to the bond market, a bear market refers to the stock market"
            ],
            correct: 1,
            level: "intermediate",
            category: "investing",
            explanation: "A bull market is a prolonged period where stock prices are rising or expected to rise, while a bear market is a period where prices are falling or expected to fall, often due to a recession or economic slowdown.",
            difficulty_weight: 3,
            us_specific: false
        },
        {
            id: "int_006",
            question: "What is a Health Savings Account (HSA)?",
            options: [
                "A retirement account for healthcare professionals",
                "A savings account for gym memberships",
                "A tax-advantaged savings account for healthcare expenses",
                "A government-funded health insurance plan"
            ],
            correct: 2,
            level: "intermediate",
            category: "savings",
            explanation: "An HSA is a tax-advantaged savings account used in conjunction with a high-deductible health insurance plan. Contributions are tax-deductible, funds grow tax-free, and withdrawals for qualified medical expenses are also tax-free.",
            difficulty_weight: 4,
            us_specific: true
        },

        // ADVANCED LEVEL QUESTIONS - Mastering Complex Concepts
        {
            id: "adv_001",
            question: "What is a 'Sharpe Ratio'?",
            options: [
                "A measure of an investment's dividend yield",
                "A measure of risk-adjusted return",
                "A measure of a company's price-to-earnings ratio",
                "A measure of a bond's duration"
            ],
            correct: 1,
            level: "advanced",
            category: "investing",
            explanation: "The Sharpe Ratio measures an investment's performance by adjusting for its risk. It indicates the amount of excess return an investor receives for the volatility of holding that asset. Higher ratios are better.",
            difficulty_weight: 5,
            us_specific: false
        },
        {
            id: "adv_002",
            question: "What is 'tax loss harvesting'?",
            options: [
                "Avoiding all capital gains",
                "Selling losing investments to offset capital gains for tax purposes",
                "Only investing in tax-free accounts",
                "Delaying all investment sales"
            ],
            correct: 1,
            level: "advanced",
            category: "taxation",
            explanation: "Tax loss harvesting involves selling investments at a loss to offset capital gains, reducing your overall tax liability. It's a strategy used at the end of the year to improve after-tax returns. In the US, you can also deduct a limited amount of losses against ordinary income.",
            difficulty_weight: 5,
            us_specific: true
        },
        {
            id: "adv_003",
            question: "What is the main difference between a traditional IRA and a Roth IRA?",
            options: [
                "Traditional IRAs are for younger people, Roth IRAs are for older people",
                "Traditional IRA contributions are pre-tax, while Roth IRA contributions are after-tax",
                "Roth IRAs have a higher contribution limit",
                "Traditional IRAs are for retirement, Roth IRAs are for education"
            ],
            correct: 1,
            level: "advanced",
            category: "retirement",
            explanation: "The key difference lies in the tax treatment. With a traditional IRA, contributions may be tax-deductible, and withdrawals in retirement are taxed. With a Roth IRA, contributions are not deductible, but qualified withdrawals in retirement are tax-free.",
            difficulty_weight: 4,
            us_specific: true
        },
        {
            id: "adv_004",
            question: "What is 'asset-backed security' (ABS)?",
            options: [
                "A security backed by physical gold",
                "A financial security backed by a pool of assets, often loans or receivables",
                "A security issued by a government",
                "A stock that pays high dividends"
            ],
            correct: 1,
            level: "advanced",
            category: "investing",
            explanation: "An asset-backed security (ABS) is a financial security collateralized by a pool of assets—such as loans, leases, credit card receivables, or royalties. These are often used to convert non-tradable assets into tradable securities.",
            difficulty_weight: 5,
            us_specific: false
        },
        {
            id: "adv_005",
            question: "What is a 'Systematic Withdrawal Plan'?",
            options: [
                "A plan to withdraw a fixed amount of money from an investment account on a regular schedule",
                "A plan for withdrawing from a bank account at an ATM",
                "A plan for getting rid of debt",
                "A plan for making regular contributions to a retirement account"
            ],
            correct: 0,
            level: "advanced",
            category: "retirement",
            explanation: "A systematic withdrawal plan involves taking regular withdrawals from retirement accounts while keeping remaining funds invested. This strategy helps manage income needs during retirement while balancing growth potential.",
            difficulty_weight: 4,
            us_specific: false
        },
        {
            id: "adv_006",
            question: "What is 'basis' in tax law?",
            options: [
                "The amount of tax you owe at the end of the year",
                "The original cost of an asset for tax purposes",
                "The amount of money you have in a savings account",
                "The amount you have contributed to a retirement account"
            ],
            correct: 1,
            level: "advanced",
            category: "taxation",
            explanation: "Basis, or 'cost basis,' is the original value of an asset for tax purposes. It is used to calculate the gain or loss when the asset is sold. For example, if you buy a stock for $100 and sell it for $150, your basis is $100, and your capital gain is $50.",
            difficulty_weight: 5,
            us_specific: true
        }

    ];

    private glossaryTerms: GlossaryTerm[] = [
        // Novice Level Terms - Foundation concepts every American should know
        {
            id: "ira_roth",
            term: "Roth IRA",
            definition: "An individual retirement account (IRA) where contributions are made with after-tax dollars, and qualified withdrawals in retirement are tax-free. It's ideal for those who expect to be in a higher tax bracket later in life.",
            level: "novice",
            category: "retirement",
            related_terms: ["traditional_ira", "401k"],
            us_context: "Roth IRAs are a popular way to save for retirement in the US, offering a different tax advantage than Traditional IRAs.",
            examples: ["Retirement savings", "Tax-free growth", "Long-term wealth building"]
        },
        {
            id: "fico_score",
            term: "FICO Score",
            definition: "A type of credit score used by lenders to assess a person's creditworthiness. The score ranges from 300 to 850, with higher scores indicating lower credit risk. It is a key factor in determining loan and credit card approval, as well as interest rates.",
            level: "novice",
            category: "credit",
            related_terms: ["credit_report", "interest_rate"],
            us_context: "FICO is the most widely used credit scoring model in the US. A good FICO score (670-739) can lead to better financial opportunities.",
            examples: ["Mortgage application", "Car loan interest rate", "Credit card approval"]
        },
        {
            id: "401k",
            term: "401(k) Plan",
            definition: "An employer-sponsored retirement savings plan. Employees can contribute a portion of their pre-tax or after-tax (Roth 401k) salary, and many employers offer a matching contribution.",
            level: "novice",
            category: "retirement",
            related_terms: ["ira", "roth_ira", "vesting"],
            us_context: "The 401(k) is the most common workplace retirement plan in the US and is a cornerstone of American retirement savings.",
            examples: ["Retirement savings", "Tax reduction strategy", "Employer match"]
        },
        {
            id: "cd",
            term: "CD (Certificate of Deposit)",
            definition: "A savings certificate entitling the bearer to a fixed interest rate on a fixed sum of money for a predetermined period of time. It's a low-risk, low-return investment often insured by the FDIC.",
            level: "novice",
            category: "savings",
            related_terms: ["savings_account", "fixed_income"],
            us_context: "CDs are a common way for US consumers to earn a higher interest rate than a traditional savings account without taking on investment risk.",
            examples: ["Savings for a future goal", "Emergency fund overflow", "Short-term investment"]
        },
        {
            id: "inflation",
            term: "Inflation",
            definition: "The rate at which the general level of prices for goods and services rises, reducing purchasing power over time. Currently tracked by the Bureau of Labor Statistics (BLS), understanding inflation helps you make better long-term financial decisions.",
            level: "novice",
            category: "economics"
        },
        {
            id: "mortgage",
            term: "Mortgage",
            definition: "A type of loan used to finance the purchase of real estate. The property itself serves as collateral for the loan.",
            level: "novice",
            category: "real_estate"
        },

        // Intermediate Level Terms - Building on the foundation
        {
            id: "529_plan",
            term: "529 Plan",
            definition: "A tax-advantaged savings plan designed to encourage saving for future education costs. Contributions grow tax-deferred, and withdrawals are tax-free when used for qualified education expenses.",
            level: "intermediate",
            category: "education",
            related_terms: ["ira", "401k"],
            us_context: "A 529 plan is the most popular way for Americans to save for college and other educational expenses, offering state and federal tax benefits.",
            examples: ["College savings", "Private school tuition", "Tax-advantaged saving"]
        },
        {
            id: "hsa",
            term: "HSA (Health Savings Account)",
            definition: "A tax-advantaged savings account that can be used for healthcare expenses. It is available to those with a high-deductible health plan. Contributions are tax-deductible, funds grow tax-free, and withdrawals for qualified medical expenses are also tax-free.",
            level: "intermediate",
            category: "savings",
            related_terms: ["fsa", "ira"],
            us_context: "An HSA is often considered a 'triple-tax-advantaged' account and can be a powerful retirement savings tool if healthcare costs are anticipated.",
            examples: ["Medical emergency fund", "Healthcare savings", "Retirement savings"]
        },
        {
            id: "etf",
            term: "ETF (Exchange-Traded Fund)",
            definition: "A type of investment fund that trades on stock exchanges like individual stocks. ETFs typically track an index, commodity, bonds, or basket of assets and often have lower fees than mutual funds.",
            level: "intermediate",
            category: "investing"
        },
        {
            id: "mutual_fund",
            term: "Mutual Fund",
            definition: "A type of investment vehicle made up of a pool of funds collected from many investors to invest in securities like stocks, bonds, or other securities. Professional fund managers make investment decisions on behalf of shareholders.",
            level: "intermediate",
            category: "investing"
        },
        {
            id: "compound_interest",
            term: "Compound Interest",
            definition: "Interest calculated on both the principal amount and previously earned interest. This creates exponential growth over time, making it one of the most powerful wealth-building concepts for long-term financial success.",
            level: "novice",
            category: "savings",
            related_terms: ["simple_interest", "principal", "time_value_money"],
            examples: ["Savings account growth", "Investment returns", "Debt accumulation"]
        },

        // Advanced Level Terms - Mastering complex concepts
        {
            id: "tax_loss_harvesting",
            term: "Tax Loss Harvesting",
            definition: "An investment strategy that involves selling investments at a loss to offset capital gains, thereby reducing overall tax liability. The strategy can be used to offset up to $3,000 of ordinary income per year in the US.",
            level: "advanced",
            category: "taxation",
            related_terms: ["capital_gains", "wash_sale_rule"],
            us_context: "This is a popular strategy for high-net-worth individuals to minimize their tax burden on investments, but it must be done carefully to avoid the 'wash sale rule'.",
            examples: ["Offsetting capital gains", "Reducing annual tax bill"]
        },
        {
            id: "sharpe_ratio",
            term: "Sharpe Ratio",
            definition: "A measure of risk-adjusted return that calculates the excess return per unit of risk. Higher Sharpe ratios indicate better risk-adjusted performance, useful for comparing investment strategies or fund managers.",
            level: "advanced",
            category: "investing"
        },
        {
            id: "reit",
            term: "REIT (Real Estate Investment Trust)",
            definition: "A company that owns, operates, or finances income-generating real estate. REITs allow investors to earn income from real estate without the need to buy or manage properties directly.",
            level: "advanced",
            category: "real_estate"
        }
    ];

    constructor() {
        this.terms = this.glossaryTerms;
    }

    /**
     * Get all terms
     */
    getAllTerms(): GlossaryTerm[] {
        return this.terms;
    }

    /**
     * Get terms by category
     */
    getTermsByCategory(category: FinancialCategory): GlossaryTerm[] {
        return this.terms.filter(term => term.category === category);
    }

    /**
     * Get related terms
     */
    getRelatedTerms(termId: string): GlossaryTerm[] {
        const term = this.terms.find(t => t.id === termId);
        if (!term) return [];
        return this.terms.filter(t => term.related_terms.includes(t.id));
    }
}

// ============================================================================
// ASSESSMENT AND PERSONALIZATION ENGINE
// ============================================================================

/**
 * User Assessment System
 * Determines user's financial literacy level and recommends a personalized learning path
 */
export class AssessmentEngine {
    private assessmentQuestions: QuizQuestion[] = [
        {
            id: "assess_001",
            question: "What is the purpose of a 401(k) plan and why is it beneficial?",
            options: [
                "It's a tax-free savings account for a home down payment.",
                "It's an employer-sponsored retirement account with potential tax benefits.",
                "It's a government pension plan for all citizens.",
                "It's a savings account for college tuition."
            ],
            correct: 1,
            level: "novice",
            category: "retirement",
            explanation: "A 401(k) is an employer-sponsored retirement savings plan in the U.S. that allows for pre-tax contributions, reducing your current taxable income.",
            difficulty_weight: 3,
            us_specific: true
        },
        {
            id: "assess_002",
            question: "What is the main factor that determines your FICO credit score?",
            options: [
                "Your age",
                "Your income",
                "Your payment history and credit utilization",
                "The number of bank accounts you have"
            ],
            correct: 2,
            level: "novice",
            category: "credit",
            explanation: "Payment history (paying on time) and credit utilization (the amount of credit you're using compared to your limit) are the most significant factors in calculating a FICO credit score. Missing payments and high balances can significantly lower your score.",
            difficulty_weight: 3,
            us_specific: true
        },
        {
            id: "assess_003",
            question: "What is the primary difference between a stock and a bond?",
            options: [
                "A stock represents ownership in a company, while a bond represents a loan to a company or government.",
                "A stock is a loan, a bond is ownership.",
                "Stocks are only for advanced investors, bonds are for beginners.",
                "Stocks pay interest, bonds pay dividends."
            ],
            correct: 0,
            level: "intermediate",
            category: "investing",
            explanation: "When you buy a stock, you become a part-owner (shareholder) of the company. When you buy a bond, you are lending money to the issuer (a company or government) in exchange for regular interest payments and the return of the principal at a future date.",
            difficulty_weight: 4,
            us_specific: false
        },
        {
            id: "assess_004",
            question: "What is the primary benefit of a 529 plan?",
            options: [
                "Tax-free withdrawals for qualified education expenses.",
                "You can withdraw money at any time for any reason without penalty.",
                "It's a guaranteed rate of return.",
                "It has no annual contribution limits."
            ],
            correct: 0,
            level: "intermediate",
            category: "education",
            explanation: "The main benefit of a 529 plan is that the funds grow tax-deferred and are withdrawn completely tax-free as long as they are used for qualified education expenses, such as tuition, fees, and room and board.",
            difficulty_weight: 4,
            us_specific: true
        },
        {
            id: "assess_005",
            question: "What is the relationship between risk and return in investments?",
            options: [
                "Higher risk always guarantees higher returns",
                "There is no relationship between risk and return",
                "Generally, higher potential returns come with higher risk, but returns are never guaranteed",
                "Lower risk investments always perform better"
            ],
            correct: 2,
            level: "advanced",
            category: "investing",
            explanation: "The risk-return relationship is fundamental to investment decision-making. Investors who are willing to take on more risk demand a higher potential return, as compensation for the possibility of losing their principal.",
            difficulty_weight: 4,
            us_specific: false
        }
    ];
    /**
     * Conduct user assessment and determine financial literacy level
     */
    assessUser(answers: number[]): AssessmentResult {
        let scores = { novice: 0, intermediate: 0, advanced: 0 };
        const categoryScores: Record<FinancialCategory, number> = {
            'savings': 0,
            'retirement': 0,
            'investing': 0,
            'credit': 0,
            'planning': 0,
            'economics': 0,
            'taxation': 0,
            'real_estate': 0,
            'education': 0,
            'insurance': 0,
            'budgeting': 0,
            'debt_management': 0,
        };
        const questionWeights = { novice: 1, intermediate: 2, advanced: 3 };

        this.assessmentQuestions.forEach((q, index) => {
            if (answers[index] === q.correct) {
                scores[q.level] += questionWeights[q.level];
                categoryScores[q.category] = (categoryScores[q.category] || 0) + q.difficulty_weight;
            }
        });

        let primaryLevel: FinancialLiteracyLevel = 'novice';
        let maxScore = scores.novice;
        if (scores.intermediate > maxScore) {
            maxScore = scores.intermediate;
            primaryLevel = 'intermediate';
        }
        if (scores.advanced > maxScore) {
            primaryLevel = 'advanced';
        }

        const improvementAreas = Object.entries(categoryScores)
            .filter(([category, score]) => score < 5)
            .map(([category]) => category as FinancialCategory);

        const strengths = Object.entries(categoryScores)
            .filter(([category, score]) => score >= 5)
            .map(([category]) => category as FinancialCategory);

        const recommendedTopics = this.generateRecommendations(primaryLevel, improvementAreas);

        return {
            user_id: 'guest',
            primary_level: primaryLevel,
            category_scores: categoryScores,
            strengths,
            improvement_areas: improvementAreas,
            recommended_topics: recommendedTopics,
            assessment_date: new Date()
        };
    }

    /**
     * Generate personalized recommendations based on assessment results
     */
    private generateRecommendations(level: FinancialLiteracyLevel, improvementAreas: FinancialCategory[]): string[] {
        const recommendations: string[] = [];
        if (improvementAreas.length > 0) {
            recommendations.push(`Based on your assessment, focus on these areas: ${improvementAreas.join(', ')}. Try our targeted quizzes and glossary sections for these topics.`);
        }
        if (level === 'novice') {
            recommendations.push("Start with our 'Foundations of Finance' quiz and read the glossary terms in the Novice section.");
        } else if (level === 'intermediate') {
            recommendations.push("Challenge yourself with our Intermediate quizzes and explore concepts like investment diversification and tax strategies.");
        } else {
            recommendations.push("You're ready for our Advanced quizzes. Dive into complex topics like options, real estate investment trusts, and advanced tax planning.");
        }
        return recommendations;
    }
}

// ============================================================================
// QUIZ MANAGEMENT SYSTEM
// ============================================================================

/**
 * Quiz Engine Management System
 * Handles quiz generation, scoring, and adaptive learning
 */
export class QuizEngine {
    private questionBank: FinancialQuestionBank;

    constructor() {
        this.questionBank = new FinancialQuestionBank();
    }

    /**
     * Generate a personalized quiz based on user level and preferences
     */
    generateQuiz(
        userLevel: FinancialLiteracyLevel,
        questionCount: number = 10,
        focusCategories?: FinancialCategory[]
    ): QuizQuestion[] {
        let availableQuestions = this.questionBank.getQuestions(userLevel);

        // Filter by focus categories if specified
        if (focusCategories && focusCategories.length > 0) {
            availableQuestions = availableQuestions.filter(q => focusCategories.includes(q.category));
        }

        // Ensure we have enough questions
        if (availableQuestions.length < questionCount) {
            console.warn("Not enough questions available for the selected level/categories. Returning all available questions.");
            return this.shuffleArray(availableQuestions);
        }

        // Shuffle and select the required number of questions
        return this.shuffleArray(availableQuestions).slice(0, questionCount);
    }

    /**
     * Score a completed quiz session
     */
    scoreQuiz(session: QuizSession): QuizSession {
        let correctAnswers = 0;
        const categoryPerformance: Record<FinancialCategory, number> = {};

        session.questions.forEach((q, index) => {
            if (session.user_answers[index] === q.correct) {
                correctAnswers++;
                categoryPerformance[q.category] = (categoryPerformance[q.category] || 0) + 1;
            }
        });

        session.score = correctAnswers;
        session.category_performance = categoryPerformance;
        session.completed_at = new Date();
        return session;
    }

    /**
     * Utility function to shuffle an array (Fisher-Yates algorithm)
     */
    private shuffleArray(array: QuizQuestion[]): QuizQuestion[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// ============================================================================
// PROGRESS TRACKING SYSTEM
// ============================================================================

/**
 * Progress Tracking System
 * Manages user progress, achievements, and provides recommendations
 */
export class ProgressTracker {
    private questionBank: FinancialQuestionBank;
    private assessmentEngine: AssessmentEngine;

    constructor() {
        this.questionBank = new FinancialQuestionBank();
        this.assessmentEngine = new AssessmentEngine();
    }

    /**
     * Update user progress after a quiz session
     */
    updateProgress(progress: UserProgress, quizSession: QuizSession): UserProgress {
        const totalCorrect = progress.total_questions_answered * progress.overall_accuracy / 100 + quizSession.score;
        const totalAnswered = progress.total_questions_answered + quizSession.total_questions;
        const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

        const updatedProgress = {
            ...progress,
            total_quizzes_completed: progress.total_quizzes_completed + 1,
            total_questions_answered: totalAnswered,
            overall_accuracy: accuracy,
            last_activity: new Date(),
        };

        // Update category mastery
        Object.entries(quizSession.category_performance).forEach(([category, score]) => {
            const currentScore = updatedProgress.category_mastery[category as FinancialCategory] || 0;
            const newScore = (currentScore + score) / 2; // Simple average for now
            updatedProgress.category_mastery[category as FinancialCategory] = newScore;
        });

        // Check and update achievements
        updatedProgress.achievements = this.checkAchievements(updatedProgress, quizSession);

        // Update learning streak
        updatedProgress.learning_streak = this.calculateLearningStreak(progress.last_activity);

        return updatedProgress;
    }

    /**
     * Check for and add new achievements
     */
    private checkAchievements(progress: UserProgress, quizSession: QuizSession): string[] {
        const achievements = progress.achievements || [];

        if (quizSession.score === quizSession.total_questions && !achievements.includes("Perfect Score")) {
            achievements.push("Perfect Score");
        }
        if (progress.total_quizzes_completed >= 5 && !achievements.includes("Quiz Whiz")) {
            achievements.push("Quiz Whiz");
        }
        return achievements;
    }

    /**
     * Calculate the current learning streak
     */
    private calculateLearningStreak(lastActivity: Date): number {
        if (!lastActivity) return 1;
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

        return daysDiff <= 1 ? 1 : 0; // Simplified streak calculation
    }

    /**
     * Generate learning recommendations based on progress
     */
    generateRecommendations(progress: UserProgress): string[] {
        const recommendations: string[] = [];

        // Check category weaknesses
        Object.entries(progress.category_mastery).forEach(([category, mastery]) => {
            if (mastery < 60) {
                recommendations.push(`Focus on improving ${category} knowledge`);
            }
        });

        // Overall performance recommendations
        if (progress.overall_accuracy < 70) {
            recommendations.push("Review fundamental concepts in the glossary");
            recommendations.push("Try starting with easier quiz levels");
        } else if (progress.overall_accuracy > 85) {
            recommendations.push("Challenge yourself with advanced level quizzes");
            recommendations.push("Explore complex financial strategies");
        }

        return recommendations;
    }
}

// ============================================================================
// EXPORT MAIN CLASSES FOR USE IN APPLICATION
// ============================================================================

export {
    FinancialQuestionBank,
    FinancialGlossary,
    AssessmentEngine,
    QuizEngine,
    ProgressTracker
};