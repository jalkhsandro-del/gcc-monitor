# Article Classification Skill

This skill describes how to classify GCC news articles into sectors and countries.

## Sector classification keywords

### CPG & Retail (`cpg_retail`)
**Companies**: Agthia, Almarai, Danone, PepsiCo, Nestle, Unilever, P&G, Mars, Mondelez, Americana, BRF, Savola, IFFCO, Al Islami Foods, National Food Products, Lulu Group, Carrefour, Spinneys, Choithrams
**Keywords**: FMCG, consumer goods, retail, supermarket, grocery, food & beverage, dairy, snacks, beverages, packaging, supply chain, consumer spending, retail sales, e-commerce grocery, quick commerce, private label

### Family Business & Conglomerates (`family_business`)
**Companies**: Majid Al Futtaim, Dubai Holding, Al Futtaim Group, Al Shaya, Chalhoub Group, Azadea, Al Ghurair, Olayan Group, Al Rajhi, Binladin Group, Al Habtoor, Landmark Group, Apparel Group, Al Tayer, Galadari, Kanoo, Al Gosaibi, Zamil Group, Al Muhaidib, SEDCO Holding
**Keywords**: family office, succession, next generation, conglomerate, diversification, group restructuring, family governance, holding company, family business, generational transfer

### Private Capital & SWFs (`private_capital`)
**Companies**: PIF (Public Investment Fund), ADIA, Mubadala, ADQ, QIA (Qatar Investment Authority), KIA (Kuwait Investment Authority), OIA (Oman Investment Authority), Bahrain Mumtalakat, EGX sovereign entities, Investcorp, Gulf Capital, Wamda Capital, STV, BECO Capital, 500 Global MENA, Algebra Ventures
**Keywords**: sovereign wealth fund, SWF, private equity, venture capital, asset management, fund raise, AUM, portfolio company, LP, GP, fund of funds, co-invest, exit, IPO pipeline, SPAC, direct investment, alternative assets, pension fund, endowment

### Tech & Digital (`tech_digital`)
**Companies**: Careem, Tabby, Tamara, Kitopi, Noon, Talabat, Anghami, Telfaz, Lean Technologies, Foodics, Salla, Zid, Hala, Pure Harvest, Iyris
**Keywords**: startup, fintech, e-commerce, SaaS, cloud, AI, artificial intelligence, digital transformation, smart city, proptech, edtech, healthtech, blockchain, crypto, digital payments, app, platform, API, cybersecurity

### Energy (`energy`)
**Keywords**: oil, gas, OPEC, crude, Brent, refinery, petrochemical, LNG, renewable, solar, hydrogen, green energy, carbon capture, ADNOC, Saudi Aramco, QatarEnergy, KPC, BAPCO, PDO, wind farm, EV, electric vehicle

### Real Estate & Construction (`real_estate_construction`)
**Keywords**: real estate, property, construction, megaproject, master developer, Emaar, DAMAC, Aldar, Nakheel, NEOM, The Line, Red Sea, Lusail, tower, residential, commercial, hospitality, hotel, mixed-use, infrastructure, rail, metro, airport

### Regulation & Policy (`regulation_policy`)
**Keywords**: regulation, law, decree, policy, tax, VAT, corporate tax, customs, labor law, Nitaqat, Saudization, Emiratization, free zone, DIFC, ADGM, QFC, central bank, CMA, SCA, monetary policy, interest rate, compliance, governance, data protection, PDPL

## Country classification

### Primary signals (strongest)
- **Source-based**: If article comes from a country-specific source (Arab News → KSA, Gulf News → UAE), default to that country
- **Entity-based**: Named entities (companies, government bodies, cities) are the strongest signal

### Secondary signals (keywords)
- **UAE**: Dubai, Abu Dhabi, Sharjah, DIFC, ADGM, DFM, ADX, DEWA, Etisalat, du, Emirates airline
- **KSA**: Riyadh, Jeddah, NEOM, PIF, Tadawul, Vision 2030, Saudi Aramco, STC, ACWA Power
- **Qatar**: Doha, Lusail, QIA, QatarEnergy, Qatar Airways, QSE, Ooredoo
- **Kuwait**: Kuwait City, KIA, KPC, Boursa Kuwait, Zain, NBK, Agility
- **Bahrain**: Manama, Mumtalakat, BAPCO, Bahrain Bourse, EDB, Aluminium Bahrain
- **Oman**: Muscat, OIA, PDO, MSM, Omantel, Bank Muscat
- **Egypt**: Cairo, EGX, NBE, Banque Misr, CIB, Orascom, Suez Canal, New Administrative Capital
- **GCC-wide**: If article mentions 3+ countries or is about GCC policy broadly

### Signal score (1-5)

- **5**: Directly names a client company or involves the user's core sectors with material impact (>$100M deal, major policy change)
- **4**: Involves a named company in the user's sectors, or a significant market event
- **3**: Relevant sector news but generic (industry trends, market reports)
- **2**: Tangentially relevant (general economic news, tourism, hospitality)
- **1**: Low relevance (sports, entertainment, lifestyle, local crime)

Filter out articles scoring 1 from the main feed. They can appear in "All" but not in sector tabs.
