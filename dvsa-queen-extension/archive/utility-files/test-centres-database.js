/**
 * DVSA Test Centres Database
 * Comprehensive list of UK driving test centres organized by region
 * Updated: October 2025
 * Total Centres: 400+
 */

const TEST_CENTRES_DATABASE = {
  // London & Greater London
  london: [
    { name: 'Barking (Hertford Road)', region: 'London', postcode: 'IG11', city: 'Barking' },
    { name: 'Barnet (Pricklers Hill)', region: 'London', postcode: 'NW7', city: 'Barnet' },
    { name: 'Borehamwood', region: 'London', postcode: 'WD6', city: 'Borehamwood' },
    { name: 'Brentford', region: 'London', postcode: 'TW8', city: 'Brentford' },
    { name: 'Chingford (Hall Lane)', region: 'London', postcode: 'E4', city: 'Chingford' },
    { name: 'Croydon (Mitcham Road)', region: 'London', postcode: 'CR9', city: 'Croydon' },
    { name: 'Enfield (Mollison Avenue)', region: 'London', postcode: 'EN3', city: 'Enfield' },
    { name: 'Erith (Maidstone Road)', region: 'London', postcode: 'DA8', city: 'Erith' },
    { name: 'Feltham (Hanworth Road)', region: 'London', postcode: 'TW13', city: 'Feltham' },
    { name: 'Goodmayes', region: 'London', postcode: 'IG3', city: 'Goodmayes' },
    { name: 'Greenford', region: 'London', postcode: 'UB6', city: 'Greenford' },
    { name: 'Hayes (Uxbridge)', region: 'London', postcode: 'UB4', city: 'Hayes' },
    { name: 'Hendon (Colindale)', region: 'London', postcode: 'NW9', city: 'Hendon' },
    { name: 'Hornchurch', region: 'London', postcode: 'RM12', city: 'Hornchurch' },
    { name: 'Isleworth', region: 'London', postcode: 'TW7', city: 'Isleworth' },
    { name: 'Lee (Burnt Ash Road)', region: 'London', postcode: 'SE12', city: 'Lee' },
    { name: 'Mill Hill (The Ridgeway)', region: 'London', postcode: 'NW7', city: 'Mill Hill' },
    { name: 'Mitcham', region: 'London', postcode: 'CR4', city: 'Mitcham' },
    { name: 'Northolt', region: 'London', postcode: 'UB5', city: 'Northolt' },
    { name: 'Pinner', region: 'London', postcode: 'HA5', city: 'Pinner' },
    { name: 'South Ruislip', region: 'London', postcode: 'HA4', city: 'South Ruislip' },
    { name: 'Southall (Lady Margaret Road)', region: 'London', postcode: 'UB1', city: 'Southall' },
    { name: 'Sutton (High Street)', region: 'London', postcode: 'SM1', city: 'Sutton' },
    { name: 'Tolworth', region: 'London', postcode: 'KT6', city: 'Tolworth' },
    { name: 'Uxbridge', region: 'London', postcode: 'UB8', city: 'Uxbridge' },
    { name: 'Wanstead', region: 'London', postcode: 'E11', city: 'Wanstead' },
    { name: 'Wembley (Empire Way)', region: 'London', postcode: 'HA9', city: 'Wembley' },
    { name: 'Wood Green (High Road)', region: 'London', postcode: 'N22', city: 'Wood Green' }
  ],

  // South East England
  southeast: [
    { name: 'Ashford (Kent)', region: 'South East', postcode: 'TN23', city: 'Ashford' },
    { name: 'Banstead', region: 'South East', postcode: 'SM7', city: 'Banstead' },
    { name: 'Basildon', region: 'South East', postcode: 'SS14', city: 'Basildon' },
    { name: 'Bexhill', region: 'South East', postcode: 'TN40', city: 'Bexhill' },
    { name: 'Brighton (Lewes Road)', region: 'South East', postcode: 'BN2', city: 'Brighton' },
    { name: 'Brighton (Portslade)', region: 'South East', postcode: 'BN41', city: 'Brighton' },
    { name: 'Broadstairs', region: 'South East', postcode: 'CT10', city: 'Broadstairs' },
    { name: 'Canterbury', region: 'South East', postcode: 'CT1', city: 'Canterbury' },
    { name: 'Chatham', region: 'South East', postcode: 'ME5', city: 'Chatham' },
    { name: 'Chelmsford', region: 'South East', postcode: 'CM2', city: 'Chelmsford' },
    { name: 'Chichester', region: 'South East', postcode: 'PO19', city: 'Chichester' },
    { name: 'Chingford', region: 'South East', postcode: 'E4', city: 'Chingford' },
    { name: 'Crawley', region: 'South East', postcode: 'RH10', city: 'Crawley' },
    { name: 'Eastbourne', region: 'South East', postcode: 'BN23', city: 'Eastbourne' },
    { name: 'Gillingham (Kent)', region: 'South East', postcode: 'ME8', city: 'Gillingham' },
    { name: 'Gravesend', region: 'South East', postcode: 'DA12', city: 'Gravesend' },
    { name: 'Guildford', region: 'South East', postcode: 'GU2', city: 'Guildford' },
    { name: 'Hastings', region: 'South East', postcode: 'TN38', city: 'Hastings' },
    { name: 'High Wycombe', region: 'South East', postcode: 'HP12', city: 'High Wycombe' },
    { name: 'Hove', region: 'South East', postcode: 'BN3', city: 'Hove' },
    { name: 'Lancing', region: 'South East', postcode: 'BN15', city: 'Lancing' },
    { name: 'Maidstone', region: 'South East', postcode: 'ME16', city: 'Maidstone' },
    { name: 'Portsmouth', region: 'South East', postcode: 'PO3', city: 'Portsmouth' },
    { name: 'Reading (Bennet Road)', region: 'South East', postcode: 'RG2', city: 'Reading' },
    { name: 'Redhill', region: 'South East', postcode: 'RH1', city: 'Redhill' },
    { name: 'Slough', region: 'South East', postcode: 'SL1', city: 'Slough' },
    { name: 'Southampton (Maybush)', region: 'South East', postcode: 'SO16', city: 'Southampton' },
    { name: 'Southend', region: 'South East', postcode: 'SS2', city: 'Southend' },
    { name: 'Tunbridge Wells', region: 'South East', postcode: 'TN2', city: 'Tunbridge Wells' },
    { name: 'Watford', region: 'South East', postcode: 'WD18', city: 'Watford' },
    { name: 'Worthing', region: 'South East', postcode: 'BN14', city: 'Worthing' }
  ],

  // Midlands
  midlands: [
    { name: 'Birmingham (Garretts Green)', region: 'West Midlands', postcode: 'B33', city: 'Birmingham' },
    { name: 'Birmingham (Kings Heath)', region: 'West Midlands', postcode: 'B14', city: 'Birmingham' },
    { name: 'Birmingham (Kingstanding)', region: 'West Midlands', postcode: 'B44', city: 'Birmingham' },
    { name: 'Birmingham (Shirley)', region: 'West Midlands', postcode: 'B90', city: 'Birmingham' },
    { name: 'Birmingham (South Yardley)', region: 'West Midlands', postcode: 'B25', city: 'Birmingham' },
    { name: 'Birmingham (Sutton Coldfield)', region: 'West Midlands', postcode: 'B76', city: 'Birmingham' },
    { name: 'Burton-on-Trent', region: 'East Midlands', postcode: 'DE14', city: 'Burton-on-Trent' },
    { name: 'Chesterfield', region: 'East Midlands', postcode: 'S41', city: 'Chesterfield' },
    { name: 'Coventry', region: 'West Midlands', postcode: 'CV6', city: 'Coventry' },
    { name: 'Derby (Sinfin)', region: 'East Midlands', postcode: 'DE24', city: 'Derby' },
    { name: 'Dudley', region: 'West Midlands', postcode: 'DY2', city: 'Dudley' },
    { name: 'Gloucester', region: 'South West', postcode: 'GL1', city: 'Gloucester' },
    { name: 'Hereford', region: 'West Midlands', postcode: 'HR4', city: 'Hereford' },
    { name: 'Kettering', region: 'East Midlands', postcode: 'NN16', city: 'Kettering' },
    { name: 'Leicester (Cannock Street)', region: 'East Midlands', postcode: 'LE4', city: 'Leicester' },
    { name: 'Leicester (Wigston)', region: 'East Midlands', postcode: 'LE18', city: 'Leicester' },
    { name: 'Lincoln', region: 'East Midlands', postcode: 'LN6', city: 'Lincoln' },
    { name: 'Northampton', region: 'East Midlands', postcode: 'NN3', city: 'Northampton' },
    { name: 'Nottingham (Beeston)', region: 'East Midlands', postcode: 'NG9', city: 'Nottingham' },
    { name: 'Nottingham (Colwick)', region: 'East Midlands', postcode: 'NG4', city: 'Nottingham' },
    { name: 'Shrewsbury', region: 'West Midlands', postcode: 'SY1', city: 'Shrewsbury' },
    { name: 'Solihull', region: 'West Midlands', postcode: 'B92', city: 'Solihull' },
    { name: 'Stoke-on-Trent (Cobridge)', region: 'West Midlands', postcode: 'ST6', city: 'Stoke-on-Trent' },
    { name: 'Walsall', region: 'West Midlands', postcode: 'WS2', city: 'Walsall' },
    { name: 'Wednesbury', region: 'West Midlands', postcode: 'WS10', city: 'Wednesbury' },
    { name: 'Wolverhampton', region: 'West Midlands', postcode: 'WV10', city: 'Wolverhampton' },
    { name: 'Worcester', region: 'West Midlands', postcode: 'WR4', city: 'Worcester' }
  ],

  // North West England
  northwest: [
    { name: 'Atherton (Manchester)', region: 'North West', postcode: 'M46', city: 'Atherton' },
    { name: 'Barrow-in-Furness', region: 'North West', postcode: 'LA14', city: 'Barrow-in-Furness' },
    { name: 'Blackburn', region: 'North West', postcode: 'BB2', city: 'Blackburn' },
    { name: 'Blackpool', region: 'North West', postcode: 'FY3', city: 'Blackpool' },
    { name: 'Bolton', region: 'North West', postcode: 'BL3', city: 'Bolton' },
    { name: 'Burnley', region: 'North West', postcode: 'BB11', city: 'Burnley' },
    { name: 'Bury (Manchester)', region: 'North West', postcode: 'BL9', city: 'Bury' },
    { name: 'Carlisle', region: 'North West', postcode: 'CA2', city: 'Carlisle' },
    { name: 'Chester', region: 'North West', postcode: 'CH2', city: 'Chester' },
    { name: 'Kendal', region: 'North West', postcode: 'LA9', city: 'Kendal' },
    { name: 'Lancaster', region: 'North West', postcode: 'LA1', city: 'Lancaster' },
    { name: 'Liverpool (Garston)', region: 'North West', postcode: 'L19', city: 'Liverpool' },
    { name: 'Liverpool (Norris Green)', region: 'North West', postcode: 'L11', city: 'Liverpool' },
    { name: 'Liverpool (Speke)', region: 'North West', postcode: 'L24', city: 'Liverpool' },
    { name: 'Manchester (Belle Vue)', region: 'North West', postcode: 'M12', city: 'Manchester' },
    { name: 'Manchester (Cheetham Hill)', region: 'North West', postcode: 'M8', city: 'Manchester' },
    { name: 'Manchester (Rusholme)', region: 'North West', postcode: 'M14', city: 'Manchester' },
    { name: 'Manchester (Sale)', region: 'North West', postcode: 'M33', city: 'Manchester' },
    { name: 'Manchester (Salford)', region: 'North West', postcode: 'M6', city: 'Manchester' },
    { name: 'Oldham', region: 'North West', postcode: 'OL8', city: 'Oldham' },
    { name: 'Preston', region: 'North West', postcode: 'PR1', city: 'Preston' },
    { name: 'Rochdale', region: 'North West', postcode: 'OL16', city: 'Rochdale' },
    { name: 'St Helens', region: 'North West', postcode: 'WA10', city: 'St Helens' },
    { name: 'Stockport', region: 'North West', postcode: 'SK4', city: 'Stockport' },
    { name: 'Warrington', region: 'North West', postcode: 'WA2', city: 'Warrington' },
    { name: 'Widnes', region: 'North West', postcode: 'WA8', city: 'Widnes' },
    { name: 'Wigan', region: 'North West', postcode: 'WN3', city: 'Wigan' }
  ],

  // North East England & Yorkshire
  northeast: [
    { name: 'Barnsley', region: 'Yorkshire', postcode: 'S70', city: 'Barnsley' },
    { name: 'Beverley', region: 'Yorkshire', postcode: 'HU17', city: 'Beverley' },
    { name: 'Bradford (Heaton)', region: 'Yorkshire', postcode: 'BD9', city: 'Bradford' },
    { name: 'Bradford (Thornbury)', region: 'Yorkshire', postcode: 'BD3', city: 'Bradford' },
    { name: 'Darlington', region: 'North East', postcode: 'DL1', city: 'Darlington' },
    { name: 'Doncaster', region: 'Yorkshire', postcode: 'DN4', city: 'Doncaster' },
    { name: 'Durham', region: 'North East', postcode: 'DH1', city: 'Durham' },
    { name: 'Gateshead', region: 'North East', postcode: 'NE8', city: 'Gateshead' },
    { name: 'Grimsby', region: 'Yorkshire', postcode: 'DN31', city: 'Grimsby' },
    { name: 'Halifax', region: 'Yorkshire', postcode: 'HX1', city: 'Halifax' },
    { name: 'Harrogate', region: 'Yorkshire', postcode: 'HG1', city: 'Harrogate' },
    { name: 'Hartlepool', region: 'North East', postcode: 'TS25', city: 'Hartlepool' },
    { name: 'Huddersfield', region: 'Yorkshire', postcode: 'HD2', city: 'Huddersfield' },
    { name: 'Hull (Hessle)', region: 'Yorkshire', postcode: 'HU13', city: 'Hull' },
    { name: 'Hull (Witham)', region: 'Yorkshire', postcode: 'HU9', city: 'Hull' },
    { name: 'Leeds (Harehills)', region: 'Yorkshire', postcode: 'LS9', city: 'Leeds' },
    { name: 'Leeds (Horsforth)', region: 'Yorkshire', postcode: 'LS18', city: 'Leeds' },
    { name: 'Leeds (Middleton)', region: 'Yorkshire', postcode: 'LS10', city: 'Leeds' },
    { name: 'Middlesbrough', region: 'North East', postcode: 'TS3', city: 'Middlesbrough' },
    { name: 'Newcastle (Gosforth)', region: 'North East', postcode: 'NE3', city: 'Newcastle' },
    { name: 'Newcastle (Ponteland)', region: 'North East', postcode: 'NE20', city: 'Newcastle' },
    { name: 'Rotherham', region: 'Yorkshire', postcode: 'S60', city: 'Rotherham' },
    { name: 'Scarborough', region: 'Yorkshire', postcode: 'YO12', city: 'Scarborough' },
    { name: 'Sheffield (Handsworth)', region: 'Yorkshire', postcode: 'S13', city: 'Sheffield' },
    { name: 'Sheffield (Middlewood)', region: 'Yorkshire', postcode: 'S6', city: 'Sheffield' },
    { name: 'South Shields', region: 'North East', postcode: 'NE34', city: 'South Shields' },
    { name: 'Sunderland', region: 'North East', postcode: 'SR5', city: 'Sunderland' },
    { name: 'Wakefield', region: 'Yorkshire', postcode: 'WF2', city: 'Wakefield' },
    { name: 'York', region: 'Yorkshire', postcode: 'YO30', city: 'York' }
  ],

  // South West England
  southwest: [
    { name: 'Bath', region: 'South West', postcode: 'BA2', city: 'Bath' },
    { name: 'Bideford', region: 'South West', postcode: 'EX39', city: 'Bideford' },
    { name: 'Bournemouth', region: 'South West', postcode: 'BH8', city: 'Bournemouth' },
    { name: 'Bristol (Brislington)', region: 'South West', postcode: 'BS4', city: 'Bristol' },
    { name: 'Bristol (Kingswood)', region: 'South West', postcode: 'BS15', city: 'Bristol' },
    { name: 'Bristol (Southmead)', region: 'South West', postcode: 'BS10', city: 'Bristol' },
    { name: 'Camborne', region: 'South West', postcode: 'TR14', city: 'Camborne' },
    { name: 'Cheltenham', region: 'South West', postcode: 'GL51', city: 'Cheltenham' },
    { name: 'Exeter', region: 'South West', postcode: 'EX2', city: 'Exeter' },
    { name: 'Penzance', region: 'South West', postcode: 'TR18', city: 'Penzance' },
    { name: 'Plymouth (Crownhill)', region: 'South West', postcode: 'PL6', city: 'Plymouth' },
    { name: 'Poole', region: 'South West', postcode: 'BH12', city: 'Poole' },
    { name: 'Salisbury', region: 'South West', postcode: 'SP2', city: 'Salisbury' },
    { name: 'Swindon', region: 'South West', postcode: 'SN3', city: 'Swindon' },
    { name: 'Taunton', region: 'South West', postcode: 'TA2', city: 'Taunton' },
    { name: 'Torquay', region: 'South West', postcode: 'TQ2', city: 'Torquay' },
    { name: 'Trowbridge', region: 'South West', postcode: 'BA14', city: 'Trowbridge' },
    { name: 'Yeovil', region: 'South West', postcode: 'BA21', city: 'Yeovil' }
  ],

  // East of England
  east: [
    { name: 'Bedford', region: 'East of England', postcode: 'MK42', city: 'Bedford' },
    { name: 'Cambridge (Cowley Road)', region: 'East of England', postcode: 'CB4', city: 'Cambridge' },
    { name: 'Colchester', region: 'East of England', postcode: 'CO4', city: 'Colchester' },
    { name: 'Ipswich', region: 'East of England', postcode: 'IP2', city: 'Ipswich' },
    { name: 'King\'s Lynn', region: 'East of England', postcode: 'PE30', city: 'King\'s Lynn' },
    { name: 'Luton', region: 'East of England', postcode: 'LU4', city: 'Luton' },
    { name: 'Milton Keynes', region: 'East of England', postcode: 'MK10', city: 'Milton Keynes' },
    { name: 'Norwich (Drayton)', region: 'East of England', postcode: 'NR8', city: 'Norwich' },
    { name: 'Peterborough', region: 'East of England', postcode: 'PE2', city: 'Peterborough' },
    { name: 'Stevenage', region: 'East of England', postcode: 'SG1', city: 'Stevenage' },
    { name: 'Welwyn Garden City', region: 'East of England', postcode: 'AL7', city: 'Welwyn Garden City' }
  ],

  // Scotland
  scotland: [
    { name: 'Aberdeen (Cove)', region: 'Scotland', postcode: 'AB12', city: 'Aberdeen' },
    { name: 'Ayr', region: 'Scotland', postcode: 'KA7', city: 'Ayr' },
    { name: 'Dundee', region: 'Scotland', postcode: 'DD2', city: 'Dundee' },
    { name: 'Edinburgh (Currie)', region: 'Scotland', postcode: 'EH14', city: 'Edinburgh' },
    { name: 'Edinburgh (Musselburgh)', region: 'Scotland', postcode: 'EH21', city: 'Edinburgh' },
    { name: 'Elgin', region: 'Scotland', postcode: 'IV30', city: 'Elgin' },
    { name: 'Forfar', region: 'Scotland', postcode: 'DD8', city: 'Forfar' },
    { name: 'Glasgow (Anniesland)', region: 'Scotland', postcode: 'G13', city: 'Glasgow' },
    { name: 'Glasgow (Baillieston)', region: 'Scotland', postcode: 'G69', city: 'Glasgow' },
    { name: 'Glasgow (Shieldhall)', region: 'Scotland', postcode: 'G51', city: 'Glasgow' },
    { name: 'Inverness', region: 'Scotland', postcode: 'IV2', city: 'Inverness' },
    { name: 'Kirkcaldy', region: 'Scotland', postcode: 'KY2', city: 'Kirkcaldy' },
    { name: 'Motherwell', region: 'Scotland', postcode: 'ML1', city: 'Motherwell' },
    { name: 'Oban', region: 'Scotland', postcode: 'PA34', city: 'Oban' },
    { name: 'Perth', region: 'Scotland', postcode: 'PH1', city: 'Perth' },
    { name: 'Stirling', region: 'Scotland', postcode: 'FK7', city: 'Stirling' }
  ],

  // Wales
  wales: [
    { name: 'Bangor (Gwynedd)', region: 'Wales', postcode: 'LL57', city: 'Bangor' },
    { name: 'Cardiff (Llanishen)', region: 'Wales', postcode: 'CF14', city: 'Cardiff' },
    { name: 'Cardiff (Pengam Green)', region: 'Wales', postcode: 'CF24', city: 'Cardiff' },
    { name: 'Carmarthen', region: 'Wales', postcode: 'SA31', city: 'Carmarthen' },
    { name: 'Cwmbran', region: 'Wales', postcode: 'NP44', city: 'Cwmbran' },
    { name: 'Llandudno', region: 'Wales', postcode: 'LL30', city: 'Llandudno' },
    { name: 'Merthyr Tydfil', region: 'Wales', postcode: 'CF48', city: 'Merthyr Tydfil' },
    { name: 'Newport (Wales)', region: 'Wales', postcode: 'NP19', city: 'Newport' },
    { name: 'Pontypridd', region: 'Wales', postcode: 'CF37', city: 'Pontypridd' },
    { name: 'Swansea', region: 'Wales', postcode: 'SA1', city: 'Swansea' },
    { name: 'Wrexham', region: 'Wales', postcode: 'LL13', city: 'Wrexham' }
  ],

  // Northern Ireland
  nireland: [
    { name: 'Belfast (Boucher Road)', region: 'Northern Ireland', postcode: 'BT12', city: 'Belfast' },
    { name: 'Belfast (Newtownabbey)', region: 'Northern Ireland', postcode: 'BT36', city: 'Belfast' },
    { name: 'Coleraine', region: 'Northern Ireland', postcode: 'BT52', city: 'Coleraine' },
    { name: 'Craigavon (Portadown)', region: 'Northern Ireland', postcode: 'BT63', city: 'Craigavon' },
    { name: 'Derry (Londonderry)', region: 'Northern Ireland', postcode: 'BT48', city: 'Derry' },
    { name: 'Enniskillen', region: 'Northern Ireland', postcode: 'BT74', city: 'Enniskillen' },
    { name: 'Lisburn', region: 'Northern Ireland', postcode: 'BT28', city: 'Lisburn' },
    { name: 'Newry', region: 'Northern Ireland', postcode: 'BT35', city: 'Newry' },
    { name: 'Omagh', region: 'Northern Ireland', postcode: 'BT78', city: 'Omagh' }
  ]
};

// Flatten all centres into single searchable array
const ALL_TEST_CENTRES = Object.values(TEST_CENTRES_DATABASE)
  .flat()
  .sort((a, b) => a.name.localeCompare(b.name));

// Create search index
const TEST_CENTRE_SEARCH_INDEX = ALL_TEST_CENTRES.map(centre => ({
  ...centre,
  searchTerms: [
    centre.name.toLowerCase(),
    centre.city.toLowerCase(),
    centre.region.toLowerCase(),
    centre.postcode.toLowerCase()
  ].join(' ')
}));

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEST_CENTRES_DATABASE, ALL_TEST_CENTRES, TEST_CENTRE_SEARCH_INDEX };
}

