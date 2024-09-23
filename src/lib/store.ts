import { create } from "zustand";
import { scaleQuantize } from "d3-scale";
import { csv } from "d3-fetch";

interface MapState {
  selectedState: { id: number; name: string };
  selectedCounties: string[];
  colorScale: (value: number) => string;
  data: any[]; // Add this line
  filteredData: any[]; // Add this line
  setSelectedState: (state: { id: number; name: string }) => void;
  updateSelectedCounties: (counties: string[]) => void;
  fetchData: () => Promise<void>; // Add this line
  filterDataByState: (stateName: string) => void; // Add this line
}

const createColorScale = () => {
  const domain = [-1, 1]; // Min and max of your domain
  const range = [
    "#11375A",
    "#4E6C8A",
    "#7590AB",
    "#A7BDD3",
    "#D2E4F6",
    "#FBCFDA",
    "#E69FB0",
    "#D6798F",
    "#C6536F",
    "#AE1C3E",
  ];

  return scaleQuantize().domain(domain).range(range);
};

const USStates =[
  {
      "id": 10,
      "name": "Delaware",
      "counties": [
          {
              "geoID": "10001",
              "countyName": "Kent"
          },
          {
              "geoID": "10005",
              "countyName": "Sussex"
          },
          {
              "geoID": "10003",
              "countyName": "New Castle"
          }
      ]
  },
  {
      "id": 11,
      "name": "District of Columbia",
      "counties": [
          {
              "geoID": "11001",
              "countyName": "District of Columbia"
          }
      ]
  },
  {
      "id": 12,
      "name": "Florida",
      "counties": [
          {
              "geoID": "12091",
              "countyName": "Okaloosa"
          },
          {
              "geoID": "12095",
              "countyName": "Orange"
          },
          {
              "geoID": "12049",
              "countyName": "Hardee"
          },
          {
              "geoID": "12107",
              "countyName": "Putnam"
          },
          {
              "geoID": "12009",
              "countyName": "Brevard"
          },
          {
              "geoID": "12015",
              "countyName": "Charlotte"
          },
          {
              "geoID": "12067",
              "countyName": "Lafayette"
          },
          {
              "geoID": "12115",
              "countyName": "Sarasota"
          },
          {
              "geoID": "12031",
              "countyName": "Duval"
          },
          {
              "geoID": "12121",
              "countyName": "Suwannee"
          },
          {
              "geoID": "12005",
              "countyName": "Bay"
          },
          {
              "geoID": "12013",
              "countyName": "Calhoun"
          },
          {
              "geoID": "12117",
              "countyName": "Seminole"
          },
          {
              "geoID": "12085",
              "countyName": "Martin"
          },
          {
              "geoID": "12047",
              "countyName": "Hamilton"
          },
          {
              "geoID": "12033",
              "countyName": "Escambia"
          },
          {
              "geoID": "12081",
              "countyName": "Manatee"
          },
          {
              "geoID": "12003",
              "countyName": "Baker"
          },
          {
              "geoID": "12099",
              "countyName": "Palm Beach"
          },
          {
              "geoID": "12127",
              "countyName": "Volusia"
          },
          {
              "geoID": "12069",
              "countyName": "Lake"
          },
          {
              "geoID": "12051",
              "countyName": "Hendry"
          },
          {
              "geoID": "12043",
              "countyName": "Glades"
          },
          {
              "geoID": "12131",
              "countyName": "Walton"
          },
          {
              "geoID": "12045",
              "countyName": "Gulf"
          },
          {
              "geoID": "12101",
              "countyName": "Pasco"
          },
          {
              "geoID": "12055",
              "countyName": "Highlands"
          },
          {
              "geoID": "12109",
              "countyName": "St. Johns"
          },
          {
              "geoID": "12001",
              "countyName": "Alachua"
          },
          {
              "geoID": "12027",
              "countyName": "DeSoto"
          },
          {
              "geoID": "12041",
              "countyName": "Gilchrist"
          },
          {
              "geoID": "12083",
              "countyName": "Marion"
          },
          {
              "geoID": "12019",
              "countyName": "Clay"
          },
          {
              "geoID": "12029",
              "countyName": "Dixie"
          },
          {
              "geoID": "12061",
              "countyName": "Indian River"
          },
          {
              "geoID": "12073",
              "countyName": "Leon"
          },
          {
              "geoID": "12075",
              "countyName": "Levy"
          },
          {
              "geoID": "12071",
              "countyName": "Lee"
          },
          {
              "geoID": "12077",
              "countyName": "Liberty"
          },
          {
              "geoID": "12103",
              "countyName": "Pinellas"
          },
          {
              "geoID": "12129",
              "countyName": "Wakulla"
          },
          {
              "geoID": "12097",
              "countyName": "Osceola"
          },
          {
              "geoID": "12087",
              "countyName": "Monroe"
          },
          {
              "geoID": "12105",
              "countyName": "Polk"
          },
          {
              "geoID": "12017",
              "countyName": "Citrus"
          },
          {
              "geoID": "12021",
              "countyName": "Collier"
          },
          {
              "geoID": "12119",
              "countyName": "Sumter"
          },
          {
              "geoID": "12011",
              "countyName": "Broward"
          },
          {
              "geoID": "12057",
              "countyName": "Hillsborough"
          },
          {
              "geoID": "12086",
              "countyName": "Miami-Dade"
          },
          {
              "geoID": "12089",
              "countyName": "Nassau"
          },
          {
              "geoID": "12123",
              "countyName": "Taylor"
          },
          {
              "geoID": "12039",
              "countyName": "Gadsden"
          },
          {
              "geoID": "12111",
              "countyName": "St. Lucie"
          },
          {
              "geoID": "12063",
              "countyName": "Jackson"
          },
          {
              "geoID": "12037",
              "countyName": "Franklin"
          },
          {
              "geoID": "12023",
              "countyName": "Columbia"
          },
          {
              "geoID": "12079",
              "countyName": "Madison"
          },
          {
              "geoID": "12059",
              "countyName": "Holmes"
          },
          {
              "geoID": "12113",
              "countyName": "Santa Rosa"
          },
          {
              "geoID": "12093",
              "countyName": "Okeechobee"
          },
          {
              "geoID": "12133",
              "countyName": "Washington"
          },
          {
              "geoID": "12065",
              "countyName": "Jefferson"
          },
          {
              "geoID": "12053",
              "countyName": "Hernando"
          },
          {
              "geoID": "12007",
              "countyName": "Bradford"
          },
          {
              "geoID": "12035",
              "countyName": "Flagler"
          },
          {
              "geoID": "12125",
              "countyName": "Union"
          }
      ]
  },
  {
      "id": 13,
      "name": "Georgia",
      "counties": [
          {
              "geoID": "13089",
              "countyName": "DeKalb"
          },
          {
              "geoID": "13267",
              "countyName": "Tattnall"
          },
          {
              "geoID": "13061",
              "countyName": "Clay"
          },
          {
              "geoID": "13133",
              "countyName": "Greene"
          },
          {
              "geoID": "13243",
              "countyName": "Randolph"
          },
          {
              "geoID": "13129",
              "countyName": "Gordon"
          },
          {
              "geoID": "13057",
              "countyName": "Cherokee"
          },
          {
              "geoID": "13211",
              "countyName": "Morgan"
          },
          {
              "geoID": "13321",
              "countyName": "Worth"
          },
          {
              "geoID": "13081",
              "countyName": "Crisp"
          },
          {
              "geoID": "13103",
              "countyName": "Effingham"
          },
          {
              "geoID": "13153",
              "countyName": "Houston"
          },
          {
              "geoID": "13231",
              "countyName": "Pike"
          },
          {
              "geoID": "13117",
              "countyName": "Forsyth"
          },
          {
              "geoID": "13113",
              "countyName": "Fayette"
          },
          {
              "geoID": "13177",
              "countyName": "Lee"
          },
          {
              "geoID": "13307",
              "countyName": "Webster"
          },
          {
              "geoID": "13189",
              "countyName": "McDuffie"
          },
          {
              "geoID": "13175",
              "countyName": "Laurens"
          },
          {
              "geoID": "13019",
              "countyName": "Berrien"
          },
          {
              "geoID": "13065",
              "countyName": "Clinch"
          },
          {
              "geoID": "13205",
              "countyName": "Mitchell"
          },
          {
              "geoID": "13131",
              "countyName": "Grady"
          },
          {
              "geoID": "13143",
              "countyName": "Haralson"
          },
          {
              "geoID": "13181",
              "countyName": "Lincoln"
          },
          {
              "geoID": "13235",
              "countyName": "Pulaski"
          },
          {
              "geoID": "13207",
              "countyName": "Monroe"
          },
          {
              "geoID": "13191",
              "countyName": "McIntosh"
          },
          {
              "geoID": "13245",
              "countyName": "Richmond"
          },
          {
              "geoID": "13221",
              "countyName": "Oglethorpe"
          },
          {
              "geoID": "13023",
              "countyName": "Bleckley"
          },
          {
              "geoID": "13197",
              "countyName": "Marion"
          },
          {
              "geoID": "13085",
              "countyName": "Dawson"
          },
          {
              "geoID": "13159",
              "countyName": "Jasper"
          },
          {
              "geoID": "13095",
              "countyName": "Dougherty"
          },
          {
              "geoID": "13157",
              "countyName": "Jackson"
          },
          {
              "geoID": "13047",
              "countyName": "Catoosa"
          },
          {
              "geoID": "13287",
              "countyName": "Turner"
          },
          {
              "geoID": "13193",
              "countyName": "Macon"
          },
          {
              "geoID": "13225",
              "countyName": "Peach"
          },
          {
              "geoID": "13219",
              "countyName": "Oconee"
          },
          {
              "geoID": "13273",
              "countyName": "Terrell"
          },
          {
              "geoID": "13075",
              "countyName": "Cook"
          },
          {
              "geoID": "13217",
              "countyName": "Newton"
          },
          {
              "geoID": "13229",
              "countyName": "Pierce"
          },
          {
              "geoID": "13223",
              "countyName": "Paulding"
          },
          {
              "geoID": "13213",
              "countyName": "Murray"
          },
          {
              "geoID": "13289",
              "countyName": "Twiggs"
          },
          {
              "geoID": "13091",
              "countyName": "Dodge"
          },
          {
              "geoID": "13187",
              "countyName": "Lumpkin"
          },
          {
              "geoID": "13035",
              "countyName": "Butts"
          },
          {
              "geoID": "13055",
              "countyName": "Chattooga"
          },
          {
              "geoID": "13227",
              "countyName": "Pickens"
          },
          {
              "geoID": "13097",
              "countyName": "Douglas"
          },
          {
              "geoID": "13039",
              "countyName": "Camden"
          },
          {
              "geoID": "13233",
              "countyName": "Polk"
          },
          {
              "geoID": "13043",
              "countyName": "Candler"
          },
          {
              "geoID": "13309",
              "countyName": "Wheeler"
          },
          {
              "geoID": "13105",
              "countyName": "Elbert"
          },
          {
              "geoID": "13281",
              "countyName": "Towns"
          },
          {
              "geoID": "13111",
              "countyName": "Fannin"
          },
          {
              "geoID": "13255",
              "countyName": "Spalding"
          },
          {
              "geoID": "13083",
              "countyName": "Dade"
          },
          {
              "geoID": "13123",
              "countyName": "Gilmer"
          },
          {
              "geoID": "13027",
              "countyName": "Brooks"
          },
          {
              "geoID": "13093",
              "countyName": "Dooly"
          },
          {
              "geoID": "13053",
              "countyName": "Chattahoochee"
          },
          {
              "geoID": "13099",
              "countyName": "Early"
          },
          {
              "geoID": "13313",
              "countyName": "Whitfield"
          },
          {
              "geoID": "13063",
              "countyName": "Clayton"
          },
          {
              "geoID": "13249",
              "countyName": "Schley"
          },
          {
              "geoID": "13317",
              "countyName": "Wilkes"
          },
          {
              "geoID": "13049",
              "countyName": "Charlton"
          },
          {
              "geoID": "13301",
              "countyName": "Warren"
          },
          {
              "geoID": "13261",
              "countyName": "Sumter"
          },
          {
              "geoID": "13137",
              "countyName": "Habersham"
          },
          {
              "geoID": "13303",
              "countyName": "Washington"
          },
          {
              "geoID": "13305",
              "countyName": "Wayne"
          },
          {
              "geoID": "13311",
              "countyName": "White"
          },
          {
              "geoID": "13125",
              "countyName": "Glascock"
          },
          {
              "geoID": "13209",
              "countyName": "Montgomery"
          },
          {
              "geoID": "13135",
              "countyName": "Gwinnett"
          },
          {
              "geoID": "13163",
              "countyName": "Jefferson"
          },
          {
              "geoID": "13001",
              "countyName": "Appling"
          },
          {
              "geoID": "13277",
              "countyName": "Tift"
          },
          {
              "geoID": "13241",
              "countyName": "Rabun"
          },
          {
              "geoID": "13185",
              "countyName": "Lowndes"
          },
          {
              "geoID": "13107",
              "countyName": "Emanuel"
          },
          {
              "geoID": "13155",
              "countyName": "Irwin"
          },
          {
              "geoID": "13101",
              "countyName": "Echols"
          },
          {
              "geoID": "13069",
              "countyName": "Coffee"
          },
          {
              "geoID": "13021",
              "countyName": "Bibb"
          },
          {
              "geoID": "13009",
              "countyName": "Baldwin"
          },
          {
              "geoID": "13013",
              "countyName": "Barrow"
          },
          {
              "geoID": "13285",
              "countyName": "Troup"
          },
          {
              "geoID": "13025",
              "countyName": "Brantley"
          },
          {
              "geoID": "13029",
              "countyName": "Bryan"
          },
          {
              "geoID": "13031",
              "countyName": "Bulloch"
          },
          {
              "geoID": "13033",
              "countyName": "Burke"
          },
          {
              "geoID": "13007",
              "countyName": "Baker"
          },
          {
              "geoID": "13087",
              "countyName": "Decatur"
          },
          {
              "geoID": "13275",
              "countyName": "Thomas"
          },
          {
              "geoID": "13315",
              "countyName": "Wilcox"
          },
          {
              "geoID": "13037",
              "countyName": "Calhoun"
          },
          {
              "geoID": "13259",
              "countyName": "Stewart"
          },
          {
              "geoID": "13071",
              "countyName": "Colquitt"
          },
          {
              "geoID": "13015",
              "countyName": "Bartow"
          },
          {
              "geoID": "13109",
              "countyName": "Evans"
          },
          {
              "geoID": "13173",
              "countyName": "Lanier"
          },
          {
              "geoID": "13119",
              "countyName": "Franklin"
          },
          {
              "geoID": "13147",
              "countyName": "Hart"
          },
          {
              "geoID": "13179",
              "countyName": "Liberty"
          },
          {
              "geoID": "13199",
              "countyName": "Meriwether"
          },
          {
              "geoID": "13215",
              "countyName": "Muscogee"
          },
          {
              "geoID": "13251",
              "countyName": "Screven"
          },
          {
              "geoID": "13253",
              "countyName": "Seminole"
          },
          {
              "geoID": "13279",
              "countyName": "Toombs"
          },
          {
              "geoID": "13263",
              "countyName": "Talbot"
          },
          {
              "geoID": "13003",
              "countyName": "Atkinson"
          },
          {
              "geoID": "13239",
              "countyName": "Quitman"
          },
          {
              "geoID": "13161",
              "countyName": "Jeff Davis"
          },
          {
              "geoID": "13005",
              "countyName": "Bacon"
          },
          {
              "geoID": "13271",
              "countyName": "Telfair"
          },
          {
              "geoID": "13141",
              "countyName": "Hancock"
          },
          {
              "geoID": "13051",
              "countyName": "Chatham"
          },
          {
              "geoID": "13183",
              "countyName": "Long"
          },
          {
              "geoID": "13237",
              "countyName": "Putnam"
          },
          {
              "geoID": "13017",
              "countyName": "Ben Hill"
          },
          {
              "geoID": "13045",
              "countyName": "Carroll"
          },
          {
              "geoID": "13257",
              "countyName": "Stephens"
          },
          {
              "geoID": "13297",
              "countyName": "Walton"
          },
          {
              "geoID": "13169",
              "countyName": "Jones"
          },
          {
              "geoID": "13079",
              "countyName": "Crawford"
          },
          {
              "geoID": "13115",
              "countyName": "Floyd"
          },
          {
              "geoID": "13299",
              "countyName": "Ware"
          },
          {
              "geoID": "13319",
              "countyName": "Wilkinson"
          },
          {
              "geoID": "13121",
              "countyName": "Fulton"
          },
          {
              "geoID": "13265",
              "countyName": "Taliaferro"
          },
          {
              "geoID": "13149",
              "countyName": "Heard"
          },
          {
              "geoID": "13171",
              "countyName": "Lamar"
          },
          {
              "geoID": "13165",
              "countyName": "Jenkins"
          },
          {
              "geoID": "13059",
              "countyName": "Clarke"
          },
          {
              "geoID": "13295",
              "countyName": "Walker"
          },
          {
              "geoID": "13145",
              "countyName": "Harris"
          },
          {
              "geoID": "13291",
              "countyName": "Union"
          },
          {
              "geoID": "13127",
              "countyName": "Glynn"
          },
          {
              "geoID": "13077",
              "countyName": "Coweta"
          },
          {
              "geoID": "13247",
              "countyName": "Rockdale"
          },
          {
              "geoID": "13151",
              "countyName": "Henry"
          },
          {
              "geoID": "13201",
              "countyName": "Miller"
          },
          {
              "geoID": "13269",
              "countyName": "Taylor"
          },
          {
              "geoID": "13067",
              "countyName": "Cobb"
          },
          {
              "geoID": "13011",
              "countyName": "Banks"
          },
          {
              "geoID": "13195",
              "countyName": "Madison"
          },
          {
              "geoID": "13283",
              "countyName": "Treutlen"
          },
          {
              "geoID": "13293",
              "countyName": "Upson"
          },
          {
              "geoID": "13139",
              "countyName": "Hall"
          },
          {
              "geoID": "13167",
              "countyName": "Johnson"
          },
          {
              "geoID": "13073",
              "countyName": "Columbia"
          }
      ]
  },
  {
      "id": 15,
      "name": "Hawaii",
      "counties": []
  },
  {
      "id": 16,
      "name": "Idaho",
      "counties": [
          {
              "geoID": "16065",
              "countyName": "Madison"
          },
          {
              "geoID": "16053",
              "countyName": "Jerome"
          },
          {
              "geoID": "16041",
              "countyName": "Franklin"
          },
          {
              "geoID": "16025",
              "countyName": "Camas"
          },
          {
              "geoID": "16083",
              "countyName": "Twin Falls"
          },
          {
              "geoID": "16051",
              "countyName": "Jefferson"
          },
          {
              "geoID": "16027",
              "countyName": "Canyon"
          },
          {
              "geoID": "16061",
              "countyName": "Lewis"
          },
          {
              "geoID": "16017",
              "countyName": "Bonner"
          },
          {
              "geoID": "16021",
              "countyName": "Boundary"
          },
          {
              "geoID": "16013",
              "countyName": "Blaine"
          },
          {
              "geoID": "16085",
              "countyName": "Valley"
          },
          {
              "geoID": "16019",
              "countyName": "Bonneville"
          },
          {
              "geoID": "16011",
              "countyName": "Bingham"
          },
          {
              "geoID": "16009",
              "countyName": "Benewah"
          },
          {
              "geoID": "16069",
              "countyName": "Nez Perce"
          },
          {
              "geoID": "16045",
              "countyName": "Gem"
          },
          {
              "geoID": "16075",
              "countyName": "Payette"
          },
          {
              "geoID": "16079",
              "countyName": "Shoshone"
          },
          {
              "geoID": "16035",
              "countyName": "Clearwater"
          },
          {
              "geoID": "16087",
              "countyName": "Washington"
          },
          {
              "geoID": "16023",
              "countyName": "Butte"
          },
          {
              "geoID": "16067",
              "countyName": "Minidoka"
          },
          {
              "geoID": "16001",
              "countyName": "Ada"
          },
          {
              "geoID": "16007",
              "countyName": "Bear Lake"
          },
          {
              "geoID": "16063",
              "countyName": "Lincoln"
          },
          {
              "geoID": "16015",
              "countyName": "Boise"
          },
          {
              "geoID": "16077",
              "countyName": "Power"
          },
          {
              "geoID": "16073",
              "countyName": "Owyhee"
          },
          {
              "geoID": "16049",
              "countyName": "Idaho"
          },
          {
              "geoID": "16071",
              "countyName": "Oneida"
          },
          {
              "geoID": "16003",
              "countyName": "Adams"
          },
          {
              "geoID": "16031",
              "countyName": "Cassia"
          },
          {
              "geoID": "16055",
              "countyName": "Kootenai"
          },
          {
              "geoID": "16037",
              "countyName": "Custer"
          },
          {
              "geoID": "16005",
              "countyName": "Bannock"
          },
          {
              "geoID": "16033",
              "countyName": "Clark"
          },
          {
              "geoID": "16043",
              "countyName": "Fremont"
          },
          {
              "geoID": "16047",
              "countyName": "Gooding"
          },
          {
              "geoID": "16057",
              "countyName": "Latah"
          },
          {
              "geoID": "16081",
              "countyName": "Teton"
          },
          {
              "geoID": "16039",
              "countyName": "Elmore"
          },
          {
              "geoID": "16029",
              "countyName": "Caribou"
          },
          {
              "geoID": "16059",
              "countyName": "Lemhi"
          }
      ]
  },
  {
      "id": 17,
      "name": "Illinois",
      "counties": [
          {
              "geoID": "17027",
              "countyName": "Clinton"
          },
          {
              "geoID": "17067",
              "countyName": "Hancock"
          },
          {
              "geoID": "17175",
              "countyName": "Stark"
          },
          {
              "geoID": "17141",
              "countyName": "Ogle"
          },
          {
              "geoID": "17075",
              "countyName": "Iroquois"
          },
          {
              "geoID": "17137",
              "countyName": "Morgan"
          },
          {
              "geoID": "17003",
              "countyName": "Alexander"
          },
          {
              "geoID": "17143",
              "countyName": "Peoria"
          },
          {
              "geoID": "17009",
              "countyName": "Brown"
          },
          {
              "geoID": "17187",
              "countyName": "Warren"
          },
          {
              "geoID": "17071",
              "countyName": "Henderson"
          },
          {
              "geoID": "17081",
              "countyName": "Jefferson"
          },
          {
              "geoID": "17087",
              "countyName": "Johnson"
          },
          {
              "geoID": "17011",
              "countyName": "Bureau"
          },
          {
              "geoID": "17005",
              "countyName": "Bond"
          },
          {
              "geoID": "17177",
              "countyName": "Stephenson"
          },
          {
              "geoID": "17159",
              "countyName": "Richland"
          },
          {
              "geoID": "17051",
              "countyName": "Fayette"
          },
          {
              "geoID": "17053",
              "countyName": "Ford"
          },
          {
              "geoID": "17063",
              "countyName": "Grundy"
          },
          {
              "geoID": "17017",
              "countyName": "Cass"
          },
          {
              "geoID": "17135",
              "countyName": "Montgomery"
          },
          {
              "geoID": "17113",
              "countyName": "McLean"
          },
          {
              "geoID": "17035",
              "countyName": "Cumberland"
          },
          {
              "geoID": "17171",
              "countyName": "Scott"
          },
          {
              "geoID": "17033",
              "countyName": "Crawford"
          },
          {
              "geoID": "17145",
              "countyName": "Perry"
          },
          {
              "geoID": "17049",
              "countyName": "Effingham"
          },
          {
              "geoID": "17189",
              "countyName": "Washington"
          },
          {
              "geoID": "17129",
              "countyName": "Menard"
          },
          {
              "geoID": "17191",
              "countyName": "Wayne"
          },
          {
              "geoID": "17101",
              "countyName": "Lawrence"
          },
          {
              "geoID": "17065",
              "countyName": "Hamilton"
          },
          {
              "geoID": "17057",
              "countyName": "Fulton"
          },
          {
              "geoID": "17131",
              "countyName": "Mercer"
          },
          {
              "geoID": "17085",
              "countyName": "Jo Daviess"
          },
          {
              "geoID": "17025",
              "countyName": "Clay"
          },
          {
              "geoID": "17127",
              "countyName": "Massac"
          },
          {
              "geoID": "17157",
              "countyName": "Randolph"
          },
          {
              "geoID": "17089",
              "countyName": "Kane"
          },
          {
              "geoID": "17059",
              "countyName": "Gallatin"
          },
          {
              "geoID": "17029",
              "countyName": "Coles"
          },
          {
              "geoID": "17093",
              "countyName": "Kendall"
          },
          {
              "geoID": "17023",
              "countyName": "Clark"
          },
          {
              "geoID": "17197",
              "countyName": "Will"
          },
          {
              "geoID": "17173",
              "countyName": "Shelby"
          },
          {
              "geoID": "17019",
              "countyName": "Champaign"
          },
          {
              "geoID": "17193",
              "countyName": "White"
          },
          {
              "geoID": "17121",
              "countyName": "Marion"
          },
          {
              "geoID": "17083",
              "countyName": "Jersey"
          },
          {
              "geoID": "17111",
              "countyName": "McHenry"
          },
          {
              "geoID": "17107",
              "countyName": "Logan"
          },
          {
              "geoID": "17167",
              "countyName": "Sangamon"
          },
          {
              "geoID": "17117",
              "countyName": "Macoupin"
          },
          {
              "geoID": "17119",
              "countyName": "Madison"
          },
          {
              "geoID": "17147",
              "countyName": "Piatt"
          },
          {
              "geoID": "17041",
              "countyName": "Douglas"
          },
          {
              "geoID": "17077",
              "countyName": "Jackson"
          },
          {
              "geoID": "17179",
              "countyName": "Tazewell"
          },
          {
              "geoID": "17097",
              "countyName": "Lake"
          },
          {
              "geoID": "17039",
              "countyName": "De Witt"
          },
          {
              "geoID": "17045",
              "countyName": "Edgar"
          },
          {
              "geoID": "17055",
              "countyName": "Franklin"
          },
          {
              "geoID": "17061",
              "countyName": "Greene"
          },
          {
              "geoID": "17099",
              "countyName": "LaSalle"
          },
          {
              "geoID": "17007",
              "countyName": "Boone"
          },
          {
              "geoID": "17133",
              "countyName": "Monroe"
          },
          {
              "geoID": "17161",
              "countyName": "Rock Island"
          },
          {
              "geoID": "17115",
              "countyName": "Macon"
          },
          {
              "geoID": "17183",
              "countyName": "Vermilion"
          },
          {
              "geoID": "17203",
              "countyName": "Woodford"
          },
          {
              "geoID": "17015",
              "countyName": "Carroll"
          },
          {
              "geoID": "17091",
              "countyName": "Kankakee"
          },
          {
              "geoID": "17109",
              "countyName": "McDonough"
          },
          {
              "geoID": "17069",
              "countyName": "Hardin"
          },
          {
              "geoID": "17195",
              "countyName": "Whiteside"
          },
          {
              "geoID": "17185",
              "countyName": "Wabash"
          },
          {
              "geoID": "17169",
              "countyName": "Schuyler"
          },
          {
              "geoID": "17105",
              "countyName": "Livingston"
          },
          {
              "geoID": "17149",
              "countyName": "Pike"
          },
          {
              "geoID": "17037",
              "countyName": "DeKalb"
          },
          {
              "geoID": "17123",
              "countyName": "Marshall"
          },
          {
              "geoID": "17199",
              "countyName": "Williamson"
          },
          {
              "geoID": "17201",
              "countyName": "Winnebago"
          },
          {
              "geoID": "17001",
              "countyName": "Adams"
          },
          {
              "geoID": "17139",
              "countyName": "Moultrie"
          },
          {
              "geoID": "17013",
              "countyName": "Calhoun"
          },
          {
              "geoID": "17047",
              "countyName": "Edwards"
          },
          {
              "geoID": "17079",
              "countyName": "Jasper"
          },
          {
              "geoID": "17103",
              "countyName": "Lee"
          },
          {
              "geoID": "17073",
              "countyName": "Henry"
          },
          {
              "geoID": "17165",
              "countyName": "Saline"
          },
          {
              "geoID": "17151",
              "countyName": "Pope"
          },
          {
              "geoID": "17043",
              "countyName": "DuPage"
          },
          {
              "geoID": "17021",
              "countyName": "Christian"
          },
          {
              "geoID": "17095",
              "countyName": "Knox"
          },
          {
              "geoID": "17155",
              "countyName": "Putnam"
          },
          {
              "geoID": "17031",
              "countyName": "Cook"
          },
          {
              "geoID": "17181",
              "countyName": "Union"
          },
          {
              "geoID": "17163",
              "countyName": "St. Clair"
          },
          {
              "geoID": "17125",
              "countyName": "Mason"
          },
          {
              "geoID": "17153",
              "countyName": "Pulaski"
          }
      ]
  },
  {
      "id": 18,
      "name": "Indiana",
      "counties": [
          {
              "geoID": "18031",
              "countyName": "Decatur"
          },
          {
              "geoID": "18169",
              "countyName": "Wabash"
          },
          {
              "geoID": "18005",
              "countyName": "Bartholomew"
          },
          {
              "geoID": "18091",
              "countyName": "LaPorte"
          },
          {
              "geoID": "18171",
              "countyName": "Warren"
          },
          {
              "geoID": "18105",
              "countyName": "Monroe"
          },
          {
              "geoID": "18181",
              "countyName": "White"
          },
          {
              "geoID": "18085",
              "countyName": "Kosciusko"
          },
          {
              "geoID": "18179",
              "countyName": "Wells"
          },
          {
              "geoID": "18137",
              "countyName": "Ripley"
          },
          {
              "geoID": "18051",
              "countyName": "Gibson"
          },
          {
              "geoID": "18001",
              "countyName": "Adams"
          },
          {
              "geoID": "18111",
              "countyName": "Newton"
          },
          {
              "geoID": "18069",
              "countyName": "Huntington"
          },
          {
              "geoID": "18097",
              "countyName": "Marion"
          },
          {
              "geoID": "18107",
              "countyName": "Montgomery"
          },
          {
              "geoID": "18135",
              "countyName": "Randolph"
          },
          {
              "geoID": "18177",
              "countyName": "Wayne"
          },
          {
              "geoID": "18045",
              "countyName": "Fountain"
          },
          {
              "geoID": "18055",
              "countyName": "Greene"
          },
          {
              "geoID": "18133",
              "countyName": "Putnam"
          },
          {
              "geoID": "18151",
              "countyName": "Steuben"
          },
          {
              "geoID": "18047",
              "countyName": "Franklin"
          },
          {
              "geoID": "18059",
              "countyName": "Hancock"
          },
          {
              "geoID": "18165",
              "countyName": "Vermillion"
          },
          {
              "geoID": "18065",
              "countyName": "Henry"
          },
          {
              "geoID": "18131",
              "countyName": "Pulaski"
          },
          {
              "geoID": "18087",
              "countyName": "LaGrange"
          },
          {
              "geoID": "18063",
              "countyName": "Hendricks"
          },
          {
              "geoID": "18033",
              "countyName": "DeKalb"
          },
          {
              "geoID": "18057",
              "countyName": "Hamilton"
          },
          {
              "geoID": "18049",
              "countyName": "Fulton"
          },
          {
              "geoID": "18003",
              "countyName": "Allen"
          },
          {
              "geoID": "18115",
              "countyName": "Ohio"
          },
          {
              "geoID": "18041",
              "countyName": "Fayette"
          },
          {
              "geoID": "18083",
              "countyName": "Knox"
          },
          {
              "geoID": "18123",
              "countyName": "Perry"
          },
          {
              "geoID": "18007",
              "countyName": "Benton"
          },
          {
              "geoID": "18075",
              "countyName": "Jay"
          },
          {
              "geoID": "18081",
              "countyName": "Johnson"
          },
          {
              "geoID": "18141",
              "countyName": "St. Joseph"
          },
          {
              "geoID": "18037",
              "countyName": "Dubois"
          },
          {
              "geoID": "18155",
              "countyName": "Switzerland"
          },
          {
              "geoID": "18175",
              "countyName": "Washington"
          },
          {
              "geoID": "18029",
              "countyName": "Dearborn"
          },
          {
              "geoID": "18149",
              "countyName": "Starke"
          },
          {
              "geoID": "18027",
              "countyName": "Daviess"
          },
          {
              "geoID": "18147",
              "countyName": "Spencer"
          },
          {
              "geoID": "18089",
              "countyName": "Lake"
          },
          {
              "geoID": "18139",
              "countyName": "Rush"
          },
          {
              "geoID": "18067",
              "countyName": "Howard"
          },
          {
              "geoID": "18129",
              "countyName": "Posey"
          },
          {
              "geoID": "18039",
              "countyName": "Elkhart"
          },
          {
              "geoID": "18025",
              "countyName": "Crawford"
          },
          {
              "geoID": "18143",
              "countyName": "Scott"
          },
          {
              "geoID": "18061",
              "countyName": "Harrison"
          },
          {
              "geoID": "18161",
              "countyName": "Union"
          },
          {
              "geoID": "18153",
              "countyName": "Sullivan"
          },
          {
              "geoID": "18019",
              "countyName": "Clark"
          },
          {
              "geoID": "18035",
              "countyName": "Delaware"
          },
          {
              "geoID": "18121",
              "countyName": "Parke"
          },
          {
              "geoID": "18009",
              "countyName": "Blackford"
          },
          {
              "geoID": "18167",
              "countyName": "Vigo"
          },
          {
              "geoID": "18103",
              "countyName": "Miami"
          },
          {
              "geoID": "18109",
              "countyName": "Morgan"
          },
          {
              "geoID": "18163",
              "countyName": "Vanderburgh"
          },
          {
              "geoID": "18079",
              "countyName": "Jennings"
          },
          {
              "geoID": "18125",
              "countyName": "Pike"
          },
          {
              "geoID": "18099",
              "countyName": "Marshall"
          },
          {
              "geoID": "18173",
              "countyName": "Warrick"
          },
          {
              "geoID": "18093",
              "countyName": "Lawrence"
          },
          {
              "geoID": "18077",
              "countyName": "Jefferson"
          },
          {
              "geoID": "18145",
              "countyName": "Shelby"
          },
          {
              "geoID": "18159",
              "countyName": "Tipton"
          },
          {
              "geoID": "18017",
              "countyName": "Cass"
          },
          {
              "geoID": "18053",
              "countyName": "Grant"
          },
          {
              "geoID": "18119",
              "countyName": "Owen"
          },
          {
              "geoID": "18015",
              "countyName": "Carroll"
          },
          {
              "geoID": "18043",
              "countyName": "Floyd"
          },
          {
              "geoID": "18071",
              "countyName": "Jackson"
          },
          {
              "geoID": "18021",
              "countyName": "Clay"
          },
          {
              "geoID": "18113",
              "countyName": "Noble"
          },
          {
              "geoID": "18095",
              "countyName": "Madison"
          },
          {
              "geoID": "18183",
              "countyName": "Whitley"
          },
          {
              "geoID": "18157",
              "countyName": "Tippecanoe"
          },
          {
              "geoID": "18011",
              "countyName": "Boone"
          },
          {
              "geoID": "18101",
              "countyName": "Martin"
          },
          {
              "geoID": "18023",
              "countyName": "Clinton"
          },
          {
              "geoID": "18013",
              "countyName": "Brown"
          },
          {
              "geoID": "18117",
              "countyName": "Orange"
          },
          {
              "geoID": "18073",
              "countyName": "Jasper"
          },
          {
              "geoID": "18127",
              "countyName": "Porter"
          }
      ]
  },
  {
      "id": 19,
      "name": "Iowa",
      "counties": [
          {
              "geoID": "19025",
              "countyName": "Calhoun"
          },
          {
              "geoID": "19161",
              "countyName": "Sac"
          },
          {
              "geoID": "19147",
              "countyName": "Palo Alto"
          },
          {
              "geoID": "19081",
              "countyName": "Hancock"
          },
          {
              "geoID": "19059",
              "countyName": "Dickinson"
          },
          {
              "geoID": "19145",
              "countyName": "Page"
          },
          {
              "geoID": "19007",
              "countyName": "Appanoose"
          },
          {
              "geoID": "19169",
              "countyName": "Story"
          },
          {
              "geoID": "19047",
              "countyName": "Crawford"
          },
          {
              "geoID": "19123",
              "countyName": "Mahaska"
          },
          {
              "geoID": "19035",
              "countyName": "Cherokee"
          },
          {
              "geoID": "19021",
              "countyName": "Buena Vista"
          },
          {
              "geoID": "19193",
              "countyName": "Woodbury"
          },
          {
              "geoID": "19159",
              "countyName": "Ringgold"
          },
          {
              "geoID": "19175",
              "countyName": "Union"
          },
          {
              "geoID": "19041",
              "countyName": "Clay"
          },
          {
              "geoID": "19073",
              "countyName": "Greene"
          },
          {
              "geoID": "19189",
              "countyName": "Winnebago"
          },
          {
              "geoID": "19195",
              "countyName": "Worth"
          },
          {
              "geoID": "19029",
              "countyName": "Cass"
          },
          {
              "geoID": "19039",
              "countyName": "Clarke"
          },
          {
              "geoID": "19055",
              "countyName": "Delaware"
          },
          {
              "geoID": "19069",
              "countyName": "Franklin"
          },
          {
              "geoID": "19101",
              "countyName": "Jefferson"
          },
          {
              "geoID": "19125",
              "countyName": "Marion"
          },
          {
              "geoID": "19149",
              "countyName": "Plymouth"
          },
          {
              "geoID": "19129",
              "countyName": "Mills"
          },
          {
              "geoID": "19185",
              "countyName": "Wayne"
          },
          {
              "geoID": "19001",
              "countyName": "Adair"
          },
          {
              "geoID": "19183",
              "countyName": "Washington"
          },
          {
              "geoID": "19087",
              "countyName": "Henry"
          },
          {
              "geoID": "19115",
              "countyName": "Louisa"
          },
          {
              "geoID": "19003",
              "countyName": "Adams"
          },
          {
              "geoID": "19017",
              "countyName": "Bremer"
          },
          {
              "geoID": "19033",
              "countyName": "Cerro Gordo"
          },
          {
              "geoID": "19135",
              "countyName": "Monroe"
          },
          {
              "geoID": "19191",
              "countyName": "Winneshiek"
          },
          {
              "geoID": "19141",
              "countyName": "O'Brien"
          },
          {
              "geoID": "19157",
              "countyName": "Poweshiek"
          },
          {
              "geoID": "19037",
              "countyName": "Chickasaw"
          },
          {
              "geoID": "19095",
              "countyName": "Iowa"
          },
          {
              "geoID": "19171",
              "countyName": "Tama"
          },
          {
              "geoID": "19109",
              "countyName": "Kossuth"
          },
          {
              "geoID": "19011",
              "countyName": "Benton"
          },
          {
              "geoID": "19155",
              "countyName": "Pottawattamie"
          },
          {
              "geoID": "19061",
              "countyName": "Dubuque"
          },
          {
              "geoID": "19197",
              "countyName": "Wright"
          },
          {
              "geoID": "19151",
              "countyName": "Pocahontas"
          },
          {
              "geoID": "19113",
              "countyName": "Linn"
          },
          {
              "geoID": "19051",
              "countyName": "Davis"
          },
          {
              "geoID": "19091",
              "countyName": "Humboldt"
          },
          {
              "geoID": "19179",
              "countyName": "Wapello"
          },
          {
              "geoID": "19031",
              "countyName": "Cedar"
          },
          {
              "geoID": "19043",
              "countyName": "Clayton"
          },
          {
              "geoID": "19181",
              "countyName": "Warren"
          },
          {
              "geoID": "19049",
              "countyName": "Dallas"
          },
          {
              "geoID": "19053",
              "countyName": "Decatur"
          },
          {
              "geoID": "19105",
              "countyName": "Jones"
          },
          {
              "geoID": "19165",
              "countyName": "Shelby"
          },
          {
              "geoID": "19119",
              "countyName": "Lyon"
          },
          {
              "geoID": "19167",
              "countyName": "Sioux"
          },
          {
              "geoID": "19121",
              "countyName": "Madison"
          },
          {
              "geoID": "19077",
              "countyName": "Guthrie"
          },
          {
              "geoID": "19103",
              "countyName": "Johnson"
          },
          {
              "geoID": "19075",
              "countyName": "Grundy"
          },
          {
              "geoID": "19137",
              "countyName": "Montgomery"
          },
          {
              "geoID": "19071",
              "countyName": "Fremont"
          },
          {
              "geoID": "19131",
              "countyName": "Mitchell"
          },
          {
              "geoID": "19117",
              "countyName": "Lucas"
          },
          {
              "geoID": "19045",
              "countyName": "Clinton"
          },
          {
              "geoID": "19067",
              "countyName": "Floyd"
          },
          {
              "geoID": "19085",
              "countyName": "Harrison"
          },
          {
              "geoID": "19057",
              "countyName": "Des Moines"
          },
          {
              "geoID": "19005",
              "countyName": "Allamakee"
          },
          {
              "geoID": "19153",
              "countyName": "Polk"
          },
          {
              "geoID": "19177",
              "countyName": "Van Buren"
          },
          {
              "geoID": "19111",
              "countyName": "Lee"
          },
          {
              "geoID": "19139",
              "countyName": "Muscatine"
          },
          {
              "geoID": "19163",
              "countyName": "Scott"
          },
          {
              "geoID": "19089",
              "countyName": "Howard"
          },
          {
              "geoID": "19093",
              "countyName": "Ida"
          },
          {
              "geoID": "19143",
              "countyName": "Osceola"
          },
          {
              "geoID": "19015",
              "countyName": "Boone"
          },
          {
              "geoID": "19173",
              "countyName": "Taylor"
          },
          {
              "geoID": "19133",
              "countyName": "Monona"
          },
          {
              "geoID": "19099",
              "countyName": "Jasper"
          },
          {
              "geoID": "19107",
              "countyName": "Keokuk"
          },
          {
              "geoID": "19083",
              "countyName": "Hardin"
          },
          {
              "geoID": "19023",
              "countyName": "Butler"
          },
          {
              "geoID": "19127",
              "countyName": "Marshall"
          },
          {
              "geoID": "19063",
              "countyName": "Emmet"
          },
          {
              "geoID": "19097",
              "countyName": "Jackson"
          },
          {
              "geoID": "19013",
              "countyName": "Black Hawk"
          },
          {
              "geoID": "19187",
              "countyName": "Webster"
          },
          {
              "geoID": "19009",
              "countyName": "Audubon"
          },
          {
              "geoID": "19019",
              "countyName": "Buchanan"
          },
          {
              "geoID": "19065",
              "countyName": "Fayette"
          },
          {
              "geoID": "19079",
              "countyName": "Hamilton"
          },
          {
              "geoID": "19027",
              "countyName": "Carroll"
          }
      ]
  },
  {
      "id": 20,
      "name": "Kansas",
      "counties": [
          {
              "geoID": "20131",
              "countyName": "Nemaha"
          },
          {
              "geoID": "20129",
              "countyName": "Morton"
          },
          {
              "geoID": "20073",
              "countyName": "Greenwood"
          },
          {
              "geoID": "20157",
              "countyName": "Republic"
          },
          {
              "geoID": "20061",
              "countyName": "Geary"
          },
          {
              "geoID": "20011",
              "countyName": "Bourbon"
          },
          {
              "geoID": "20051",
              "countyName": "Ellis"
          },
          {
              "geoID": "20165",
              "countyName": "Rush"
          },
          {
              "geoID": "20119",
              "countyName": "Meade"
          },
          {
              "geoID": "20125",
              "countyName": "Montgomery"
          },
          {
              "geoID": "20205",
              "countyName": "Wilson"
          },
          {
              "geoID": "20171",
              "countyName": "Scott"
          },
          {
              "geoID": "20083",
              "countyName": "Hodgeman"
          },
          {
              "geoID": "20155",
              "countyName": "Reno"
          },
          {
              "geoID": "20199",
              "countyName": "Wallace"
          },
          {
              "geoID": "20031",
              "countyName": "Coffey"
          },
          {
              "geoID": "20207",
              "countyName": "Woodson"
          },
          {
              "geoID": "20111",
              "countyName": "Lyon"
          },
          {
              "geoID": "20133",
              "countyName": "Neosho"
          },
          {
              "geoID": "20055",
              "countyName": "Finney"
          },
          {
              "geoID": "20093",
              "countyName": "Kearny"
          },
          {
              "geoID": "20013",
              "countyName": "Brown"
          },
          {
              "geoID": "20003",
              "countyName": "Anderson"
          },
          {
              "geoID": "20193",
              "countyName": "Thomas"
          },
          {
              "geoID": "20163",
              "countyName": "Rooks"
          },
          {
              "geoID": "20053",
              "countyName": "Ellsworth"
          },
          {
              "geoID": "20045",
              "countyName": "Douglas"
          },
          {
              "geoID": "20065",
              "countyName": "Graham"
          },
          {
              "geoID": "20101",
              "countyName": "Lane"
          },
          {
              "geoID": "20123",
              "countyName": "Mitchell"
          },
          {
              "geoID": "20195",
              "countyName": "Trego"
          },
          {
              "geoID": "20041",
              "countyName": "Dickinson"
          },
          {
              "geoID": "20151",
              "countyName": "Pratt"
          },
          {
              "geoID": "20141",
              "countyName": "Osborne"
          },
          {
              "geoID": "20105",
              "countyName": "Lincoln"
          },
          {
              "geoID": "20189",
              "countyName": "Stevens"
          },
          {
              "geoID": "20025",
              "countyName": "Clark"
          },
          {
              "geoID": "20169",
              "countyName": "Saline"
          },
          {
              "geoID": "20167",
              "countyName": "Russell"
          },
          {
              "geoID": "20035",
              "countyName": "Cowley"
          },
          {
              "geoID": "20147",
              "countyName": "Phillips"
          },
          {
              "geoID": "20159",
              "countyName": "Rice"
          },
          {
              "geoID": "20085",
              "countyName": "Jackson"
          },
          {
              "geoID": "20161",
              "countyName": "Riley"
          },
          {
              "geoID": "20007",
              "countyName": "Barber"
          },
          {
              "geoID": "20117",
              "countyName": "Marshall"
          },
          {
              "geoID": "20097",
              "countyName": "Kiowa"
          },
          {
              "geoID": "20029",
              "countyName": "Cloud"
          },
          {
              "geoID": "20049",
              "countyName": "Elk"
          },
          {
              "geoID": "20067",
              "countyName": "Grant"
          },
          {
              "geoID": "20075",
              "countyName": "Hamilton"
          },
          {
              "geoID": "20209",
              "countyName": "Wyandotte"
          },
          {
              "geoID": "20183",
              "countyName": "Smith"
          },
          {
              "geoID": "20107",
              "countyName": "Linn"
          },
          {
              "geoID": "20077",
              "countyName": "Harper"
          },
          {
              "geoID": "20115",
              "countyName": "Marion"
          },
          {
              "geoID": "20087",
              "countyName": "Jefferson"
          },
          {
              "geoID": "20139",
              "countyName": "Osage"
          },
          {
              "geoID": "20127",
              "countyName": "Morris"
          },
          {
              "geoID": "20187",
              "countyName": "Stanton"
          },
          {
              "geoID": "20033",
              "countyName": "Comanche"
          },
          {
              "geoID": "20095",
              "countyName": "Kingman"
          },
          {
              "geoID": "20181",
              "countyName": "Sherman"
          },
          {
              "geoID": "20197",
              "countyName": "Wabaunsee"
          },
          {
              "geoID": "20001",
              "countyName": "Allen"
          },
          {
              "geoID": "20037",
              "countyName": "Crawford"
          },
          {
              "geoID": "20063",
              "countyName": "Gove"
          },
          {
              "geoID": "20149",
              "countyName": "Pottawatomie"
          },
          {
              "geoID": "20191",
              "countyName": "Sumner"
          },
          {
              "geoID": "20047",
              "countyName": "Edwards"
          },
          {
              "geoID": "20005",
              "countyName": "Atchison"
          },
          {
              "geoID": "20145",
              "countyName": "Pawnee"
          },
          {
              "geoID": "20071",
              "countyName": "Greeley"
          },
          {
              "geoID": "20121",
              "countyName": "Miami"
          },
          {
              "geoID": "20153",
              "countyName": "Rawlins"
          },
          {
              "geoID": "20015",
              "countyName": "Butler"
          },
          {
              "geoID": "20039",
              "countyName": "Decatur"
          },
          {
              "geoID": "20043",
              "countyName": "Doniphan"
          },
          {
              "geoID": "20089",
              "countyName": "Jewell"
          },
          {
              "geoID": "20137",
              "countyName": "Norton"
          },
          {
              "geoID": "20069",
              "countyName": "Gray"
          },
          {
              "geoID": "20203",
              "countyName": "Wichita"
          },
          {
              "geoID": "20021",
              "countyName": "Cherokee"
          },
          {
              "geoID": "20057",
              "countyName": "Ford"
          },
          {
              "geoID": "20009",
              "countyName": "Barton"
          },
          {
              "geoID": "20019",
              "countyName": "Chautauqua"
          },
          {
              "geoID": "20113",
              "countyName": "McPherson"
          },
          {
              "geoID": "20175",
              "countyName": "Seward"
          },
          {
              "geoID": "20081",
              "countyName": "Haskell"
          },
          {
              "geoID": "20079",
              "countyName": "Harvey"
          },
          {
              "geoID": "20177",
              "countyName": "Shawnee"
          },
          {
              "geoID": "20091",
              "countyName": "Johnson"
          },
          {
              "geoID": "20103",
              "countyName": "Leavenworth"
          },
          {
              "geoID": "20201",
              "countyName": "Washington"
          },
          {
              "geoID": "20179",
              "countyName": "Sheridan"
          },
          {
              "geoID": "20023",
              "countyName": "Cheyenne"
          },
          {
              "geoID": "20017",
              "countyName": "Chase"
          },
          {
              "geoID": "20185",
              "countyName": "Stafford"
          },
          {
              "geoID": "20173",
              "countyName": "Sedgwick"
          },
          {
              "geoID": "20059",
              "countyName": "Franklin"
          },
          {
              "geoID": "20135",
              "countyName": "Ness"
          },
          {
              "geoID": "20099",
              "countyName": "Labette"
          },
          {
              "geoID": "20027",
              "countyName": "Clay"
          },
          {
              "geoID": "20143",
              "countyName": "Ottawa"
          },
          {
              "geoID": "20109",
              "countyName": "Logan"
          }
      ]
  },
  {
      "id": 21,
      "name": "Kentucky",
      "counties": [
          {
              "geoID": "21129",
              "countyName": "Lee"
          },
          {
              "geoID": "21191",
              "countyName": "Pendleton"
          },
          {
              "geoID": "21019",
              "countyName": "Boyd"
          },
          {
              "geoID": "21037",
              "countyName": "Campbell"
          },
          {
              "geoID": "21157",
              "countyName": "Marshall"
          },
          {
              "geoID": "21119",
              "countyName": "Knott"
          },
          {
              "geoID": "21065",
              "countyName": "Estill"
          },
          {
              "geoID": "21215",
              "countyName": "Spencer"
          },
          {
              "geoID": "21187",
              "countyName": "Owen"
          },
          {
              "geoID": "21075",
              "countyName": "Fulton"
          },
          {
              "geoID": "21083",
              "countyName": "Graves"
          },
          {
              "geoID": "21143",
              "countyName": "Lyon"
          },
          {
              "geoID": "21165",
              "countyName": "Menifee"
          },
          {
              "geoID": "21181",
              "countyName": "Nicholas"
          },
          {
              "geoID": "21219",
              "countyName": "Todd"
          },
          {
              "geoID": "21233",
              "countyName": "Webster"
          },
          {
              "geoID": "21033",
              "countyName": "Caldwell"
          },
          {
              "geoID": "21227",
              "countyName": "Warren"
          },
          {
              "geoID": "21221",
              "countyName": "Trigg"
          },
          {
              "geoID": "21093",
              "countyName": "Hardin"
          },
          {
              "geoID": "21113",
              "countyName": "Jessamine"
          },
          {
              "geoID": "21115",
              "countyName": "Johnson"
          },
          {
              "geoID": "21027",
              "countyName": "Breckinridge"
          },
          {
              "geoID": "21123",
              "countyName": "Larue"
          },
          {
              "geoID": "21039",
              "countyName": "Carlisle"
          },
          {
              "geoID": "21095",
              "countyName": "Harlan"
          },
          {
              "geoID": "21189",
              "countyName": "Owsley"
          },
          {
              "geoID": "21125",
              "countyName": "Laurel"
          },
          {
              "geoID": "21147",
              "countyName": "McCreary"
          },
          {
              "geoID": "21047",
              "countyName": "Christian"
          },
          {
              "geoID": "21001",
              "countyName": "Adair"
          },
          {
              "geoID": "21051",
              "countyName": "Clay"
          },
          {
              "geoID": "21235",
              "countyName": "Whitley"
          },
          {
              "geoID": "21171",
              "countyName": "Monroe"
          },
          {
              "geoID": "21131",
              "countyName": "Leslie"
          },
          {
              "geoID": "21203",
              "countyName": "Rockcastle"
          },
          {
              "geoID": "21041",
              "countyName": "Carroll"
          },
          {
              "geoID": "21081",
              "countyName": "Grant"
          },
          {
              "geoID": "21167",
              "countyName": "Mercer"
          },
          {
              "geoID": "21169",
              "countyName": "Metcalfe"
          },
          {
              "geoID": "21025",
              "countyName": "Breathitt"
          },
          {
              "geoID": "21005",
              "countyName": "Anderson"
          },
          {
              "geoID": "21015",
              "countyName": "Boone"
          },
          {
              "geoID": "21141",
              "countyName": "Logan"
          },
          {
              "geoID": "21009",
              "countyName": "Barren"
          },
          {
              "geoID": "21099",
              "countyName": "Hart"
          },
          {
              "geoID": "21193",
              "countyName": "Perry"
          },
          {
              "geoID": "21173",
              "countyName": "Montgomery"
          },
          {
              "geoID": "21223",
              "countyName": "Trimble"
          },
          {
              "geoID": "21117",
              "countyName": "Kenton"
          },
          {
              "geoID": "21229",
              "countyName": "Washington"
          },
          {
              "geoID": "21067",
              "countyName": "Fayette"
          },
          {
              "geoID": "21021",
              "countyName": "Boyle"
          },
          {
              "geoID": "21145",
              "countyName": "McCracken"
          },
          {
              "geoID": "21153",
              "countyName": "Magoffin"
          },
          {
              "geoID": "21003",
              "countyName": "Allen"
          },
          {
              "geoID": "21059",
              "countyName": "Daviess"
          },
          {
              "geoID": "21205",
              "countyName": "Rowan"
          },
          {
              "geoID": "21091",
              "countyName": "Hancock"
          },
          {
              "geoID": "21105",
              "countyName": "Hickman"
          },
          {
              "geoID": "21121",
              "countyName": "Knox"
          },
          {
              "geoID": "21127",
              "countyName": "Lawrence"
          },
          {
              "geoID": "21133",
              "countyName": "Letcher"
          },
          {
              "geoID": "21135",
              "countyName": "Lewis"
          },
          {
              "geoID": "21069",
              "countyName": "Fleming"
          },
          {
              "geoID": "21239",
              "countyName": "Woodford"
          },
          {
              "geoID": "21209",
              "countyName": "Scott"
          },
          {
              "geoID": "21185",
              "countyName": "Oldham"
          },
          {
              "geoID": "21137",
              "countyName": "Lincoln"
          },
          {
              "geoID": "21183",
              "countyName": "Ohio"
          },
          {
              "geoID": "21197",
              "countyName": "Powell"
          },
          {
              "geoID": "21213",
              "countyName": "Simpson"
          },
          {
              "geoID": "21225",
              "countyName": "Union"
          },
          {
              "geoID": "21013",
              "countyName": "Bell"
          },
          {
              "geoID": "21023",
              "countyName": "Bracken"
          },
          {
              "geoID": "21031",
              "countyName": "Butler"
          },
          {
              "geoID": "21007",
              "countyName": "Ballard"
          },
          {
              "geoID": "21111",
              "countyName": "Jefferson"
          },
          {
              "geoID": "21211",
              "countyName": "Shelby"
          },
          {
              "geoID": "21071",
              "countyName": "Floyd"
          },
          {
              "geoID": "21085",
              "countyName": "Grayson"
          },
          {
              "geoID": "21101",
              "countyName": "Henderson"
          },
          {
              "geoID": "21107",
              "countyName": "Hopkins"
          },
          {
              "geoID": "21011",
              "countyName": "Bath"
          },
          {
              "geoID": "21043",
              "countyName": "Carter"
          },
          {
              "geoID": "21035",
              "countyName": "Calloway"
          },
          {
              "geoID": "21103",
              "countyName": "Henry"
          },
          {
              "geoID": "21149",
              "countyName": "McLean"
          },
          {
              "geoID": "21175",
              "countyName": "Morgan"
          },
          {
              "geoID": "21207",
              "countyName": "Russell"
          },
          {
              "geoID": "21053",
              "countyName": "Clinton"
          },
          {
              "geoID": "21217",
              "countyName": "Taylor"
          },
          {
              "geoID": "21079",
              "countyName": "Garrard"
          },
          {
              "geoID": "21139",
              "countyName": "Livingston"
          },
          {
              "geoID": "21045",
              "countyName": "Casey"
          },
          {
              "geoID": "21151",
              "countyName": "Madison"
          },
          {
              "geoID": "21029",
              "countyName": "Bullitt"
          },
          {
              "geoID": "21201",
              "countyName": "Robertson"
          },
          {
              "geoID": "21087",
              "countyName": "Green"
          },
          {
              "geoID": "21077",
              "countyName": "Gallatin"
          },
          {
              "geoID": "21163",
              "countyName": "Meade"
          },
          {
              "geoID": "21049",
              "countyName": "Clark"
          },
          {
              "geoID": "21055",
              "countyName": "Crittenden"
          },
          {
              "geoID": "21057",
              "countyName": "Cumberland"
          },
          {
              "geoID": "21155",
              "countyName": "Marion"
          },
          {
              "geoID": "21231",
              "countyName": "Wayne"
          },
          {
              "geoID": "21179",
              "countyName": "Nelson"
          },
          {
              "geoID": "21161",
              "countyName": "Mason"
          },
          {
              "geoID": "21073",
              "countyName": "Franklin"
          },
          {
              "geoID": "21097",
              "countyName": "Harrison"
          },
          {
              "geoID": "21063",
              "countyName": "Elliott"
          },
          {
              "geoID": "21195",
              "countyName": "Pike"
          },
          {
              "geoID": "21199",
              "countyName": "Pulaski"
          },
          {
              "geoID": "21159",
              "countyName": "Martin"
          },
          {
              "geoID": "21237",
              "countyName": "Wolfe"
          },
          {
              "geoID": "21017",
              "countyName": "Bourbon"
          },
          {
              "geoID": "21177",
              "countyName": "Muhlenberg"
          },
          {
              "geoID": "21061",
              "countyName": "Edmonson"
          },
          {
              "geoID": "21089",
              "countyName": "Greenup"
          },
          {
              "geoID": "21109",
              "countyName": "Jackson"
          }
      ]
  },
  {
      "id": 22,
      "name": "Louisiana",
      "counties": [
          {
              "geoID": "22063",
              "countyName": "Livingston"
          },
          {
              "geoID": "22127",
              "countyName": "Winn"
          },
          {
              "geoID": "22093",
              "countyName": "St. James"
          },
          {
              "geoID": "22091",
              "countyName": "St. Helena"
          },
          {
              "geoID": "22021",
              "countyName": "Caldwell"
          },
          {
              "geoID": "22027",
              "countyName": "Claiborne"
          },
          {
              "geoID": "22067",
              "countyName": "Morehouse"
          },
          {
              "geoID": "22105",
              "countyName": "Tangipahoa"
          },
          {
              "geoID": "22001",
              "countyName": "Acadia"
          },
          {
              "geoID": "22037",
              "countyName": "East Feliciana"
          },
          {
              "geoID": "22061",
              "countyName": "Lincoln"
          },
          {
              "geoID": "22079",
              "countyName": "Rapides"
          },
          {
              "geoID": "22017",
              "countyName": "Caddo"
          },
          {
              "geoID": "22023",
              "countyName": "Cameron"
          },
          {
              "geoID": "22101",
              "countyName": "St. Mary"
          },
          {
              "geoID": "22007",
              "countyName": "Assumption"
          },
          {
              "geoID": "22031",
              "countyName": "De Soto"
          },
          {
              "geoID": "22043",
              "countyName": "Grant"
          },
          {
              "geoID": "22073",
              "countyName": "Ouachita"
          },
          {
              "geoID": "22103",
              "countyName": "St. Tammany"
          },
          {
              "geoID": "22009",
              "countyName": "Avoyelles"
          },
          {
              "geoID": "22087",
              "countyName": "St. Bernard"
          },
          {
              "geoID": "22115",
              "countyName": "Vernon"
          },
          {
              "geoID": "22003",
              "countyName": "Allen"
          },
          {
              "geoID": "22085",
              "countyName": "Sabine"
          },
          {
              "geoID": "22069",
              "countyName": "Natchitoches"
          },
          {
              "geoID": "22013",
              "countyName": "Bienville"
          },
          {
              "geoID": "22015",
              "countyName": "Bossier"
          },
          {
              "geoID": "22081",
              "countyName": "Red River"
          },
          {
              "geoID": "22019",
              "countyName": "Calcasieu"
          },
          {
              "geoID": "22029",
              "countyName": "Concordia"
          },
          {
              "geoID": "22049",
              "countyName": "Jackson"
          },
          {
              "geoID": "22041",
              "countyName": "Franklin"
          },
          {
              "geoID": "22035",
              "countyName": "East Carroll"
          },
          {
              "geoID": "22045",
              "countyName": "Iberia"
          },
          {
              "geoID": "22065",
              "countyName": "Madison"
          },
          {
              "geoID": "22071",
              "countyName": "Orleans"
          },
          {
              "geoID": "22075",
              "countyName": "Plaquemines"
          },
          {
              "geoID": "22077",
              "countyName": "Pointe Coupee"
          },
          {
              "geoID": "22011",
              "countyName": "Beauregard"
          },
          {
              "geoID": "22053",
              "countyName": "Jefferson Davis"
          },
          {
              "geoID": "22111",
              "countyName": "Union"
          },
          {
              "geoID": "22089",
              "countyName": "St. Charles"
          },
          {
              "geoID": "22095",
              "countyName": "St. John the Baptist"
          },
          {
              "geoID": "22107",
              "countyName": "Tensas"
          },
          {
              "geoID": "22125",
              "countyName": "West Feliciana"
          },
          {
              "geoID": "22109",
              "countyName": "Terrebonne"
          },
          {
              "geoID": "22033",
              "countyName": "East Baton Rouge"
          },
          {
              "geoID": "22057",
              "countyName": "Lafourche"
          },
          {
              "geoID": "22083",
              "countyName": "Richland"
          },
          {
              "geoID": "22121",
              "countyName": "West Baton Rouge"
          },
          {
              "geoID": "22113",
              "countyName": "Vermilion"
          },
          {
              "geoID": "22005",
              "countyName": "Ascension"
          },
          {
              "geoID": "22059",
              "countyName": "LaSalle"
          },
          {
              "geoID": "22055",
              "countyName": "Lafayette"
          },
          {
              "geoID": "22117",
              "countyName": "Washington"
          },
          {
              "geoID": "22051",
              "countyName": "Jefferson"
          },
          {
              "geoID": "22119",
              "countyName": "Webster"
          },
          {
              "geoID": "22123",
              "countyName": "West Carroll"
          },
          {
              "geoID": "22025",
              "countyName": "Catahoula"
          },
          {
              "geoID": "22097",
              "countyName": "St. Landry"
          },
          {
              "geoID": "22047",
              "countyName": "Iberville"
          },
          {
              "geoID": "22039",
              "countyName": "Evangeline"
          },
          {
              "geoID": "22099",
              "countyName": "St. Martin"
          }
      ]
  },
  {
      "id": 23,
      "name": "Maine",
      "counties": [
          {
              "geoID": "23027",
              "countyName": "Waldo"
          },
          {
              "geoID": "23001",
              "countyName": "Androscoggin"
          },
          {
              "geoID": "23009",
              "countyName": "Hancock"
          },
          {
              "geoID": "23023",
              "countyName": "Sagadahoc"
          },
          {
              "geoID": "23019",
              "countyName": "Penobscot"
          },
          {
              "geoID": "23007",
              "countyName": "Franklin"
          },
          {
              "geoID": "23003",
              "countyName": "Aroostook"
          },
          {
              "geoID": "23031",
              "countyName": "York"
          },
          {
              "geoID": "23025",
              "countyName": "Somerset"
          },
          {
              "geoID": "23011",
              "countyName": "Kennebec"
          },
          {
              "geoID": "23029",
              "countyName": "Washington"
          },
          {
              "geoID": "23021",
              "countyName": "Piscataquis"
          },
          {
              "geoID": "23017",
              "countyName": "Oxford"
          },
          {
              "geoID": "23013",
              "countyName": "Knox"
          },
          {
              "geoID": "23005",
              "countyName": "Cumberland"
          },
          {
              "geoID": "23015",
              "countyName": "Lincoln"
          }
      ]
  },
  {
      "id": 24,
      "name": "Maryland",
      "counties": [
          {
              "geoID": "24023",
              "countyName": "Garrett"
          },
          {
              "geoID": "24011",
              "countyName": "Caroline"
          },
          {
              "geoID": "24005",
              "countyName": "Baltimore"
          },
          {
              "geoID": "24047",
              "countyName": "Worcester"
          },
          {
              "geoID": "24009",
              "countyName": "Calvert"
          },
          {
              "geoID": "24019",
              "countyName": "Dorchester"
          },
          {
              "geoID": "24015",
              "countyName": "Cecil"
          },
          {
              "geoID": "24017",
              "countyName": "Charles"
          },
          {
              "geoID": "24025",
              "countyName": "Harford"
          },
          {
              "geoID": "24037",
              "countyName": "St. Mary's"
          },
          {
              "geoID": "24039",
              "countyName": "Somerset"
          },
          {
              "geoID": "24041",
              "countyName": "Talbot"
          },
          {
              "geoID": "24043",
              "countyName": "Washington"
          },
          {
              "geoID": "24510",
              "countyName": "Baltimore"
          },
          {
              "geoID": "24045",
              "countyName": "Wicomico"
          },
          {
              "geoID": "24003",
              "countyName": "Anne Arundel"
          },
          {
              "geoID": "24033",
              "countyName": "Prince George's"
          },
          {
              "geoID": "24021",
              "countyName": "Frederick"
          },
          {
              "geoID": "24029",
              "countyName": "Kent"
          },
          {
              "geoID": "24035",
              "countyName": "Queen Anne's"
          },
          {
              "geoID": "24001",
              "countyName": "Allegany"
          },
          {
              "geoID": "24027",
              "countyName": "Howard"
          },
          {
              "geoID": "24013",
              "countyName": "Carroll"
          },
          {
              "geoID": "24031",
              "countyName": "Montgomery"
          }
      ]
  },
  {
      "id": 25,
      "name": "Massachusetts",
      "counties": [
          {
              "geoID": "25025",
              "countyName": "Suffolk"
          },
          {
              "geoID": "25013",
              "countyName": "Hampden"
          },
          {
              "geoID": "25017",
              "countyName": "Middlesex"
          },
          {
              "geoID": "25001",
              "countyName": "Barnstable"
          },
          {
              "geoID": "25005",
              "countyName": "Bristol"
          },
          {
              "geoID": "25009",
              "countyName": "Essex"
          },
          {
              "geoID": "25023",
              "countyName": "Plymouth"
          },
          {
              "geoID": "25021",
              "countyName": "Norfolk"
          },
          {
              "geoID": "25003",
              "countyName": "Berkshire"
          },
          {
              "geoID": "25015",
              "countyName": "Hampshire"
          },
          {
              "geoID": "25019",
              "countyName": "Nantucket"
          },
          {
              "geoID": "25011",
              "countyName": "Franklin"
          },
          {
              "geoID": "25027",
              "countyName": "Worcester"
          },
          {
              "geoID": "25007",
              "countyName": "Dukes"
          }
      ]
  },
  {
      "id": 26,
      "name": "Michigan",
      "counties": [
          {
              "geoID": "26107",
              "countyName": "Mecosta"
          },
          {
              "geoID": "26077",
              "countyName": "Kalamazoo"
          },
          {
              "geoID": "26123",
              "countyName": "Newaygo"
          },
          {
              "geoID": "26101",
              "countyName": "Manistee"
          },
          {
              "geoID": "26065",
              "countyName": "Ingham"
          },
          {
              "geoID": "26029",
              "countyName": "Charlevoix"
          },
          {
              "geoID": "26037",
              "countyName": "Clinton"
          },
          {
              "geoID": "26103",
              "countyName": "Marquette"
          },
          {
              "geoID": "26139",
              "countyName": "Ottawa"
          },
          {
              "geoID": "26149",
              "countyName": "St. Joseph"
          },
          {
              "geoID": "26135",
              "countyName": "Oscoda"
          },
          {
              "geoID": "26005",
              "countyName": "Allegan"
          },
          {
              "geoID": "26057",
              "countyName": "Gratiot"
          },
          {
              "geoID": "26085",
              "countyName": "Lake"
          },
          {
              "geoID": "26031",
              "countyName": "Cheboygan"
          },
          {
              "geoID": "26035",
              "countyName": "Clare"
          },
          {
              "geoID": "26011",
              "countyName": "Arenac"
          },
          {
              "geoID": "26119",
              "countyName": "Montmorency"
          },
          {
              "geoID": "26115",
              "countyName": "Monroe"
          },
          {
              "geoID": "26095",
              "countyName": "Luce"
          },
          {
              "geoID": "26049",
              "countyName": "Genesee"
          },
          {
              "geoID": "26079",
              "countyName": "Kalkaska"
          },
          {
              "geoID": "26019",
              "countyName": "Benzie"
          },
          {
              "geoID": "26133",
              "countyName": "Osceola"
          },
          {
              "geoID": "26007",
              "countyName": "Alpena"
          },
          {
              "geoID": "26017",
              "countyName": "Bay"
          },
          {
              "geoID": "26163",
              "countyName": "Wayne"
          },
          {
              "geoID": "26091",
              "countyName": "Lenawee"
          },
          {
              "geoID": "26129",
              "countyName": "Ogemaw"
          },
          {
              "geoID": "26087",
              "countyName": "Lapeer"
          },
          {
              "geoID": "26121",
              "countyName": "Muskegon"
          },
          {
              "geoID": "26131",
              "countyName": "Ontonagon"
          },
          {
              "geoID": "26165",
              "countyName": "Wexford"
          },
          {
              "geoID": "26009",
              "countyName": "Antrim"
          },
          {
              "geoID": "26041",
              "countyName": "Delta"
          },
          {
              "geoID": "26013",
              "countyName": "Baraga"
          },
          {
              "geoID": "26151",
              "countyName": "Sanilac"
          },
          {
              "geoID": "26003",
              "countyName": "Alger"
          },
          {
              "geoID": "26127",
              "countyName": "Oceana"
          },
          {
              "geoID": "26027",
              "countyName": "Cass"
          },
          {
              "geoID": "26051",
              "countyName": "Gladwin"
          },
          {
              "geoID": "26083",
              "countyName": "Keweenaw"
          },
          {
              "geoID": "26075",
              "countyName": "Jackson"
          },
          {
              "geoID": "26081",
              "countyName": "Kent"
          },
          {
              "geoID": "26059",
              "countyName": "Hillsdale"
          },
          {
              "geoID": "26141",
              "countyName": "Presque Isle"
          },
          {
              "geoID": "26137",
              "countyName": "Otsego"
          },
          {
              "geoID": "26097",
              "countyName": "Mackinac"
          },
          {
              "geoID": "26153",
              "countyName": "Schoolcraft"
          },
          {
              "geoID": "26105",
              "countyName": "Mason"
          },
          {
              "geoID": "26001",
              "countyName": "Alcona"
          },
          {
              "geoID": "26145",
              "countyName": "Saginaw"
          },
          {
              "geoID": "26147",
              "countyName": "St. Clair"
          },
          {
              "geoID": "26047",
              "countyName": "Emmet"
          },
          {
              "geoID": "26155",
              "countyName": "Shiawassee"
          },
          {
              "geoID": "26033",
              "countyName": "Chippewa"
          },
          {
              "geoID": "26089",
              "countyName": "Leelanau"
          },
          {
              "geoID": "26055",
              "countyName": "Grand Traverse"
          },
          {
              "geoID": "26021",
              "countyName": "Berrien"
          },
          {
              "geoID": "26143",
              "countyName": "Roscommon"
          },
          {
              "geoID": "26043",
              "countyName": "Dickinson"
          },
          {
              "geoID": "26117",
              "countyName": "Montcalm"
          },
          {
              "geoID": "26061",
              "countyName": "Houghton"
          },
          {
              "geoID": "26111",
              "countyName": "Midland"
          },
          {
              "geoID": "26023",
              "countyName": "Branch"
          },
          {
              "geoID": "26015",
              "countyName": "Barry"
          },
          {
              "geoID": "26109",
              "countyName": "Menominee"
          },
          {
              "geoID": "26069",
              "countyName": "Iosco"
          },
          {
              "geoID": "26053",
              "countyName": "Gogebic"
          },
          {
              "geoID": "26063",
              "countyName": "Huron"
          },
          {
              "geoID": "26039",
              "countyName": "Crawford"
          },
          {
              "geoID": "26067",
              "countyName": "Ionia"
          },
          {
              "geoID": "26073",
              "countyName": "Isabella"
          },
          {
              "geoID": "26157",
              "countyName": "Tuscola"
          },
          {
              "geoID": "26161",
              "countyName": "Washtenaw"
          },
          {
              "geoID": "26071",
              "countyName": "Iron"
          },
          {
              "geoID": "26113",
              "countyName": "Missaukee"
          },
          {
              "geoID": "26025",
              "countyName": "Calhoun"
          },
          {
              "geoID": "26159",
              "countyName": "Van Buren"
          },
          {
              "geoID": "26045",
              "countyName": "Eaton"
          },
          {
              "geoID": "26093",
              "countyName": "Livingston"
          },
          {
              "geoID": "26125",
              "countyName": "Oakland"
          },
          {
              "geoID": "26099",
              "countyName": "Macomb"
          }
      ]
  },
  {
      "id": 27,
      "name": "Minnesota",
      "counties": [
          {
              "geoID": "27173",
              "countyName": "Yellow Medicine"
          },
          {
              "geoID": "27047",
              "countyName": "Freeborn"
          },
          {
              "geoID": "27105",
              "countyName": "Nobles"
          },
          {
              "geoID": "27153",
              "countyName": "Todd"
          },
          {
              "geoID": "27035",
              "countyName": "Crow Wing"
          },
          {
              "geoID": "27043",
              "countyName": "Faribault"
          },
          {
              "geoID": "27079",
              "countyName": "Le Sueur"
          },
          {
              "geoID": "27103",
              "countyName": "Nicollet"
          },
          {
              "geoID": "27107",
              "countyName": "Norman"
          },
          {
              "geoID": "27117",
              "countyName": "Pipestone"
          },
          {
              "geoID": "27151",
              "countyName": "Swift"
          },
          {
              "geoID": "27097",
              "countyName": "Morrison"
          },
          {
              "geoID": "27017",
              "countyName": "Carlton"
          },
          {
              "geoID": "27057",
              "countyName": "Hubbard"
          },
          {
              "geoID": "27007",
              "countyName": "Beltrami"
          },
          {
              "geoID": "27001",
              "countyName": "Aitkin"
          },
          {
              "geoID": "27093",
              "countyName": "Meeker"
          },
          {
              "geoID": "27121",
              "countyName": "Pope"
          },
          {
              "geoID": "27111",
              "countyName": "Otter Tail"
          },
          {
              "geoID": "27099",
              "countyName": "Mower"
          },
          {
              "geoID": "27013",
              "countyName": "Blue Earth"
          },
          {
              "geoID": "27155",
              "countyName": "Traverse"
          },
          {
              "geoID": "27129",
              "countyName": "Renville"
          },
          {
              "geoID": "27133",
              "countyName": "Rock"
          },
          {
              "geoID": "27131",
              "countyName": "Rice"
          },
          {
              "geoID": "27125",
              "countyName": "Red Lake"
          },
          {
              "geoID": "27119",
              "countyName": "Polk"
          },
          {
              "geoID": "27149",
              "countyName": "Stevens"
          },
          {
              "geoID": "27141",
              "countyName": "Sherburne"
          },
          {
              "geoID": "27037",
              "countyName": "Dakota"
          },
          {
              "geoID": "27113",
              "countyName": "Pennington"
          },
          {
              "geoID": "27021",
              "countyName": "Cass"
          },
          {
              "geoID": "27033",
              "countyName": "Cottonwood"
          },
          {
              "geoID": "27015",
              "countyName": "Brown"
          },
          {
              "geoID": "27143",
              "countyName": "Sibley"
          },
          {
              "geoID": "27073",
              "countyName": "Lac qui Parle"
          },
          {
              "geoID": "27071",
              "countyName": "Koochiching"
          },
          {
              "geoID": "27005",
              "countyName": "Becker"
          },
          {
              "geoID": "27091",
              "countyName": "Martin"
          },
          {
              "geoID": "27027",
              "countyName": "Clay"
          },
          {
              "geoID": "27095",
              "countyName": "Mille Lacs"
          },
          {
              "geoID": "27045",
              "countyName": "Fillmore"
          },
          {
              "geoID": "27055",
              "countyName": "Houston"
          },
          {
              "geoID": "27031",
              "countyName": "Cook"
          },
          {
              "geoID": "27109",
              "countyName": "Olmsted"
          },
          {
              "geoID": "27145",
              "countyName": "Stearns"
          },
          {
              "geoID": "27161",
              "countyName": "Waseca"
          },
          {
              "geoID": "27165",
              "countyName": "Watonwan"
          },
          {
              "geoID": "27089",
              "countyName": "Marshall"
          },
          {
              "geoID": "27085",
              "countyName": "McLeod"
          },
          {
              "geoID": "27039",
              "countyName": "Dodge"
          },
          {
              "geoID": "27009",
              "countyName": "Benton"
          },
          {
              "geoID": "27003",
              "countyName": "Anoka"
          },
          {
              "geoID": "27135",
              "countyName": "Roseau"
          },
          {
              "geoID": "27115",
              "countyName": "Pine"
          },
          {
              "geoID": "27069",
              "countyName": "Kittson"
          },
          {
              "geoID": "27083",
              "countyName": "Lyon"
          },
          {
              "geoID": "27077",
              "countyName": "Lake of the Woods"
          },
          {
              "geoID": "27127",
              "countyName": "Redwood"
          },
          {
              "geoID": "27075",
              "countyName": "Lake"
          },
          {
              "geoID": "27123",
              "countyName": "Ramsey"
          },
          {
              "geoID": "27051",
              "countyName": "Grant"
          },
          {
              "geoID": "27137",
              "countyName": "St. Louis"
          },
          {
              "geoID": "27019",
              "countyName": "Carver"
          },
          {
              "geoID": "27171",
              "countyName": "Wright"
          },
          {
              "geoID": "27159",
              "countyName": "Wadena"
          },
          {
              "geoID": "27169",
              "countyName": "Winona"
          },
          {
              "geoID": "27067",
              "countyName": "Kandiyohi"
          },
          {
              "geoID": "27061",
              "countyName": "Itasca"
          },
          {
              "geoID": "27025",
              "countyName": "Chisago"
          },
          {
              "geoID": "27081",
              "countyName": "Lincoln"
          },
          {
              "geoID": "27049",
              "countyName": "Goodhue"
          },
          {
              "geoID": "27029",
              "countyName": "Clearwater"
          },
          {
              "geoID": "27167",
              "countyName": "Wilkin"
          },
          {
              "geoID": "27139",
              "countyName": "Scott"
          },
          {
              "geoID": "27063",
              "countyName": "Jackson"
          },
          {
              "geoID": "27059",
              "countyName": "Isanti"
          },
          {
              "geoID": "27041",
              "countyName": "Douglas"
          },
          {
              "geoID": "27023",
              "countyName": "Chippewa"
          },
          {
              "geoID": "27087",
              "countyName": "Mahnomen"
          },
          {
              "geoID": "27053",
              "countyName": "Hennepin"
          },
          {
              "geoID": "27065",
              "countyName": "Kanabec"
          },
          {
              "geoID": "27101",
              "countyName": "Murray"
          },
          {
              "geoID": "27147",
              "countyName": "Steele"
          },
          {
              "geoID": "27157",
              "countyName": "Wabasha"
          },
          {
              "geoID": "27163",
              "countyName": "Washington"
          },
          {
              "geoID": "27011",
              "countyName": "Big Stone"
          }
      ]
  },
  {
      "id": 28,
      "name": "Mississippi",
      "counties": [
          {
              "geoID": "28153",
              "countyName": "Wayne"
          },
          {
              "geoID": "28127",
              "countyName": "Simpson"
          },
          {
              "geoID": "28035",
              "countyName": "Forrest"
          },
          {
              "geoID": "28141",
              "countyName": "Tishomingo"
          },
          {
              "geoID": "28009",
              "countyName": "Benton"
          },
          {
              "geoID": "28147",
              "countyName": "Walthall"
          },
          {
              "geoID": "28105",
              "countyName": "Oktibbeha"
          },
          {
              "geoID": "28109",
              "countyName": "Pearl River"
          },
          {
              "geoID": "28065",
              "countyName": "Jefferson Davis"
          },
          {
              "geoID": "28119",
              "countyName": "Quitman"
          },
          {
              "geoID": "28091",
              "countyName": "Marion"
          },
          {
              "geoID": "28023",
              "countyName": "Clarke"
          },
          {
              "geoID": "28085",
              "countyName": "Lincoln"
          },
          {
              "geoID": "28005",
              "countyName": "Amite"
          },
          {
              "geoID": "28157",
              "countyName": "Wilkinson"
          },
          {
              "geoID": "28003",
              "countyName": "Alcorn"
          },
          {
              "geoID": "28019",
              "countyName": "Choctaw"
          },
          {
              "geoID": "28159",
              "countyName": "Winston"
          },
          {
              "geoID": "28031",
              "countyName": "Covington"
          },
          {
              "geoID": "28087",
              "countyName": "Lowndes"
          },
          {
              "geoID": "28039",
              "countyName": "George"
          },
          {
              "geoID": "28021",
              "countyName": "Claiborne"
          },
          {
              "geoID": "28163",
              "countyName": "Yazoo"
          },
          {
              "geoID": "28155",
              "countyName": "Webster"
          },
          {
              "geoID": "28095",
              "countyName": "Monroe"
          },
          {
              "geoID": "28161",
              "countyName": "Yalobusha"
          },
          {
              "geoID": "28041",
              "countyName": "Greene"
          },
          {
              "geoID": "28151",
              "countyName": "Washington"
          },
          {
              "geoID": "28131",
              "countyName": "Stone"
          },
          {
              "geoID": "28129",
              "countyName": "Smith"
          },
          {
              "geoID": "28045",
              "countyName": "Hancock"
          },
          {
              "geoID": "28103",
              "countyName": "Noxubee"
          },
          {
              "geoID": "28133",
              "countyName": "Sunflower"
          },
          {
              "geoID": "28125",
              "countyName": "Sharkey"
          },
          {
              "geoID": "28115",
              "countyName": "Pontotoc"
          },
          {
              "geoID": "28117",
              "countyName": "Prentiss"
          },
          {
              "geoID": "28093",
              "countyName": "Marshall"
          },
          {
              "geoID": "28139",
              "countyName": "Tippah"
          },
          {
              "geoID": "28001",
              "countyName": "Adams"
          },
          {
              "geoID": "28081",
              "countyName": "Lee"
          },
          {
              "geoID": "28111",
              "countyName": "Perry"
          },
          {
              "geoID": "28029",
              "countyName": "Copiah"
          },
          {
              "geoID": "28145",
              "countyName": "Union"
          },
          {
              "geoID": "28121",
              "countyName": "Rankin"
          },
          {
              "geoID": "28083",
              "countyName": "Leflore"
          },
          {
              "geoID": "28049",
              "countyName": "Hinds"
          },
          {
              "geoID": "28007",
              "countyName": "Attala"
          },
          {
              "geoID": "28015",
              "countyName": "Carroll"
          },
          {
              "geoID": "28069",
              "countyName": "Kemper"
          },
          {
              "geoID": "28053",
              "countyName": "Humphreys"
          },
          {
              "geoID": "28097",
              "countyName": "Montgomery"
          },
          {
              "geoID": "28143",
              "countyName": "Tunica"
          },
          {
              "geoID": "28051",
              "countyName": "Holmes"
          },
          {
              "geoID": "28123",
              "countyName": "Scott"
          },
          {
              "geoID": "28057",
              "countyName": "Itawamba"
          },
          {
              "geoID": "28113",
              "countyName": "Pike"
          },
          {
              "geoID": "28013",
              "countyName": "Calhoun"
          },
          {
              "geoID": "28061",
              "countyName": "Jasper"
          },
          {
              "geoID": "28037",
              "countyName": "Franklin"
          },
          {
              "geoID": "28089",
              "countyName": "Madison"
          },
          {
              "geoID": "28011",
              "countyName": "Bolivar"
          },
          {
              "geoID": "28137",
              "countyName": "Tate"
          },
          {
              "geoID": "28075",
              "countyName": "Lauderdale"
          },
          {
              "geoID": "28043",
              "countyName": "Grenada"
          },
          {
              "geoID": "28099",
              "countyName": "Neshoba"
          },
          {
              "geoID": "28017",
              "countyName": "Chickasaw"
          },
          {
              "geoID": "28055",
              "countyName": "Issaquena"
          },
          {
              "geoID": "28033",
              "countyName": "DeSoto"
          },
          {
              "geoID": "28067",
              "countyName": "Jones"
          },
          {
              "geoID": "28073",
              "countyName": "Lamar"
          },
          {
              "geoID": "28149",
              "countyName": "Warren"
          },
          {
              "geoID": "28063",
              "countyName": "Jefferson"
          },
          {
              "geoID": "28025",
              "countyName": "Clay"
          },
          {
              "geoID": "28101",
              "countyName": "Newton"
          },
          {
              "geoID": "28107",
              "countyName": "Panola"
          },
          {
              "geoID": "28077",
              "countyName": "Lawrence"
          },
          {
              "geoID": "28059",
              "countyName": "Jackson"
          },
          {
              "geoID": "28071",
              "countyName": "Lafayette"
          },
          {
              "geoID": "28047",
              "countyName": "Harrison"
          },
          {
              "geoID": "28079",
              "countyName": "Leake"
          },
          {
              "geoID": "28027",
              "countyName": "Coahoma"
          },
          {
              "geoID": "28135",
              "countyName": "Tallahatchie"
          }
      ]
  },
  {
      "id": 29,
      "name": "Missouri",
      "counties": [
          {
              "geoID": "29055",
              "countyName": "Crawford"
          },
          {
              "geoID": "29229",
              "countyName": "Wright"
          },
          {
              "geoID": "29003",
              "countyName": "Andrew"
          },
          {
              "geoID": "29139",
              "countyName": "Montgomery"
          },
          {
              "geoID": "29195",
              "countyName": "Saline"
          },
          {
              "geoID": "29039",
              "countyName": "Cedar"
          },
          {
              "geoID": "29129",
              "countyName": "Mercer"
          },
          {
              "geoID": "29007",
              "countyName": "Audrain"
          },
          {
              "geoID": "29205",
              "countyName": "Shelby"
          },
          {
              "geoID": "29219",
              "countyName": "Warren"
          },
          {
              "geoID": "29177",
              "countyName": "Ray"
          },
          {
              "geoID": "29009",
              "countyName": "Barry"
          },
          {
              "geoID": "29043",
              "countyName": "Christian"
          },
          {
              "geoID": "29057",
              "countyName": "Dade"
          },
          {
              "geoID": "29125",
              "countyName": "Maries"
          },
          {
              "geoID": "29011",
              "countyName": "Barton"
          },
          {
              "geoID": "29159",
              "countyName": "Pettis"
          },
          {
              "geoID": "29199",
              "countyName": "Scotland"
          },
          {
              "geoID": "29017",
              "countyName": "Bollinger"
          },
          {
              "geoID": "29091",
              "countyName": "Howell"
          },
          {
              "geoID": "29093",
              "countyName": "Iron"
          },
          {
              "geoID": "29223",
              "countyName": "Wayne"
          },
          {
              "geoID": "29063",
              "countyName": "DeKalb"
          },
          {
              "geoID": "29171",
              "countyName": "Putnam"
          },
          {
              "geoID": "29013",
              "countyName": "Bates"
          },
          {
              "geoID": "29075",
              "countyName": "Gentry"
          },
          {
              "geoID": "29051",
              "countyName": "Cole"
          },
          {
              "geoID": "29151",
              "countyName": "Osage"
          },
          {
              "geoID": "29153",
              "countyName": "Ozark"
          },
          {
              "geoID": "29053",
              "countyName": "Cooper"
          },
          {
              "geoID": "29145",
              "countyName": "Newton"
          },
          {
              "geoID": "29115",
              "countyName": "Linn"
          },
          {
              "geoID": "29211",
              "countyName": "Sullivan"
          },
          {
              "geoID": "29227",
              "countyName": "Worth"
          },
          {
              "geoID": "29510",
              "countyName": "St. Louis"
          },
          {
              "geoID": "29037",
              "countyName": "Cass"
          },
          {
              "geoID": "29213",
              "countyName": "Taney"
          },
          {
              "geoID": "29197",
              "countyName": "Schuyler"
          },
          {
              "geoID": "29023",
              "countyName": "Butler"
          },
          {
              "geoID": "29135",
              "countyName": "Moniteau"
          },
          {
              "geoID": "29201",
              "countyName": "Scott"
          },
          {
              "geoID": "29137",
              "countyName": "Monroe"
          },
          {
              "geoID": "29203",
              "countyName": "Shannon"
          },
          {
              "geoID": "29147",
              "countyName": "Nodaway"
          },
          {
              "geoID": "29095",
              "countyName": "Jackson"
          },
          {
              "geoID": "29065",
              "countyName": "Dent"
          },
          {
              "geoID": "29181",
              "countyName": "Ripley"
          },
          {
              "geoID": "29119",
              "countyName": "McDonald"
          },
          {
              "geoID": "29217",
              "countyName": "Vernon"
          },
          {
              "geoID": "29035",
              "countyName": "Carter"
          },
          {
              "geoID": "29109",
              "countyName": "Lawrence"
          },
          {
              "geoID": "29067",
              "countyName": "Douglas"
          },
          {
              "geoID": "29001",
              "countyName": "Adair"
          },
          {
              "geoID": "29005",
              "countyName": "Atchison"
          },
          {
              "geoID": "29049",
              "countyName": "Clinton"
          },
          {
              "geoID": "29041",
              "countyName": "Chariton"
          },
          {
              "geoID": "29131",
              "countyName": "Miller"
          },
          {
              "geoID": "29015",
              "countyName": "Benton"
          },
          {
              "geoID": "29121",
              "countyName": "Macon"
          },
          {
              "geoID": "29071",
              "countyName": "Franklin"
          },
          {
              "geoID": "29089",
              "countyName": "Howard"
          },
          {
              "geoID": "29157",
              "countyName": "Perry"
          },
          {
              "geoID": "29077",
              "countyName": "Greene"
          },
          {
              "geoID": "29221",
              "countyName": "Washington"
          },
          {
              "geoID": "29103",
              "countyName": "Knox"
          },
          {
              "geoID": "29117",
              "countyName": "Livingston"
          },
          {
              "geoID": "29187",
              "countyName": "St. Francois"
          },
          {
              "geoID": "29069",
              "countyName": "Dunklin"
          },
          {
              "geoID": "29141",
              "countyName": "Morgan"
          },
          {
              "geoID": "29143",
              "countyName": "New Madrid"
          },
          {
              "geoID": "29149",
              "countyName": "Oregon"
          },
          {
              "geoID": "29047",
              "countyName": "Clay"
          },
          {
              "geoID": "29079",
              "countyName": "Grundy"
          },
          {
              "geoID": "29165",
              "countyName": "Platte"
          },
          {
              "geoID": "29207",
              "countyName": "Stoddard"
          },
          {
              "geoID": "29029",
              "countyName": "Camden"
          },
          {
              "geoID": "29175",
              "countyName": "Randolph"
          },
          {
              "geoID": "29215",
              "countyName": "Texas"
          },
          {
              "geoID": "29025",
              "countyName": "Caldwell"
          },
          {
              "geoID": "29045",
              "countyName": "Clark"
          },
          {
              "geoID": "29081",
              "countyName": "Harrison"
          },
          {
              "geoID": "29183",
              "countyName": "St. Charles"
          },
          {
              "geoID": "29189",
              "countyName": "St. Louis"
          },
          {
              "geoID": "29111",
              "countyName": "Lewis"
          },
          {
              "geoID": "29097",
              "countyName": "Jasper"
          },
          {
              "geoID": "29033",
              "countyName": "Carroll"
          },
          {
              "geoID": "29209",
              "countyName": "Stone"
          },
          {
              "geoID": "29113",
              "countyName": "Lincoln"
          },
          {
              "geoID": "29031",
              "countyName": "Cape Girardeau"
          },
          {
              "geoID": "29059",
              "countyName": "Dallas"
          },
          {
              "geoID": "29099",
              "countyName": "Jefferson"
          },
          {
              "geoID": "29019",
              "countyName": "Boone"
          },
          {
              "geoID": "29123",
              "countyName": "Madison"
          },
          {
              "geoID": "29155",
              "countyName": "Pemiscot"
          },
          {
              "geoID": "29179",
              "countyName": "Reynolds"
          },
          {
              "geoID": "29167",
              "countyName": "Polk"
          },
          {
              "geoID": "29173",
              "countyName": "Ralls"
          },
          {
              "geoID": "29087",
              "countyName": "Holt"
          },
          {
              "geoID": "29185",
              "countyName": "St. Clair"
          },
          {
              "geoID": "29021",
              "countyName": "Buchanan"
          },
          {
              "geoID": "29169",
              "countyName": "Pulaski"
          },
          {
              "geoID": "29083",
              "countyName": "Henry"
          },
          {
              "geoID": "29161",
              "countyName": "Phelps"
          },
          {
              "geoID": "29105",
              "countyName": "Laclede"
          },
          {
              "geoID": "29186",
              "countyName": "Ste. Genevieve"
          },
          {
              "geoID": "29061",
              "countyName": "Daviess"
          },
          {
              "geoID": "29127",
              "countyName": "Marion"
          },
          {
              "geoID": "29101",
              "countyName": "Johnson"
          },
          {
              "geoID": "29085",
              "countyName": "Hickory"
          },
          {
              "geoID": "29225",
              "countyName": "Webster"
          },
          {
              "geoID": "29027",
              "countyName": "Callaway"
          },
          {
              "geoID": "29073",
              "countyName": "Gasconade"
          },
          {
              "geoID": "29107",
              "countyName": "Lafayette"
          },
          {
              "geoID": "29133",
              "countyName": "Mississippi"
          },
          {
              "geoID": "29163",
              "countyName": "Pike"
          }
      ]
  },
  {
      "id": 30,
      "name": "Montana",
      "counties": [
          {
              "geoID": "30091",
              "countyName": "Sheridan"
          },
          {
              "geoID": "30101",
              "countyName": "Toole"
          },
          {
              "geoID": "30047",
              "countyName": "Lake"
          },
          {
              "geoID": "30081",
              "countyName": "Ravalli"
          },
          {
              "geoID": "30055",
              "countyName": "McCone"
          },
          {
              "geoID": "30001",
              "countyName": "Beaverhead"
          },
          {
              "geoID": "30061",
              "countyName": "Mineral"
          },
          {
              "geoID": "30019",
              "countyName": "Daniels"
          },
          {
              "geoID": "30009",
              "countyName": "Carbon"
          },
          {
              "geoID": "30015",
              "countyName": "Chouteau"
          },
          {
              "geoID": "30043",
              "countyName": "Jefferson"
          },
          {
              "geoID": "30029",
              "countyName": "Flathead"
          },
          {
              "geoID": "30079",
              "countyName": "Prairie"
          },
          {
              "geoID": "30065",
              "countyName": "Musselshell"
          },
          {
              "geoID": "30041",
              "countyName": "Hill"
          },
          {
              "geoID": "30025",
              "countyName": "Fallon"
          },
          {
              "geoID": "30105",
              "countyName": "Valley"
          },
          {
              "geoID": "30023",
              "countyName": "Deer Lodge"
          },
          {
              "geoID": "30035",
              "countyName": "Glacier"
          },
          {
              "geoID": "30039",
              "countyName": "Granite"
          },
          {
              "geoID": "30075",
              "countyName": "Powder River"
          },
          {
              "geoID": "30033",
              "countyName": "Garfield"
          },
          {
              "geoID": "30049",
              "countyName": "Lewis and Clark"
          },
          {
              "geoID": "30053",
              "countyName": "Lincoln"
          },
          {
              "geoID": "30099",
              "countyName": "Teton"
          },
          {
              "geoID": "30107",
              "countyName": "Wheatland"
          },
          {
              "geoID": "30051",
              "countyName": "Liberty"
          },
          {
              "geoID": "30067",
              "countyName": "Park"
          },
          {
              "geoID": "30109",
              "countyName": "Wibaux"
          },
          {
              "geoID": "30005",
              "countyName": "Blaine"
          },
          {
              "geoID": "30103",
              "countyName": "Treasure"
          },
          {
              "geoID": "30037",
              "countyName": "Golden Valley"
          },
          {
              "geoID": "30045",
              "countyName": "Judith Basin"
          },
          {
              "geoID": "30059",
              "countyName": "Meagher"
          },
          {
              "geoID": "30011",
              "countyName": "Carter"
          },
          {
              "geoID": "30069",
              "countyName": "Petroleum"
          },
          {
              "geoID": "30097",
              "countyName": "Sweet Grass"
          },
          {
              "geoID": "30093",
              "countyName": "Silver Bow"
          },
          {
              "geoID": "30057",
              "countyName": "Madison"
          },
          {
              "geoID": "30021",
              "countyName": "Dawson"
          },
          {
              "geoID": "30017",
              "countyName": "Custer"
          },
          {
              "geoID": "30083",
              "countyName": "Richland"
          },
          {
              "geoID": "30111",
              "countyName": "Yellowstone"
          },
          {
              "geoID": "30089",
              "countyName": "Sanders"
          },
          {
              "geoID": "30073",
              "countyName": "Pondera"
          },
          {
              "geoID": "30031",
              "countyName": "Gallatin"
          },
          {
              "geoID": "30087",
              "countyName": "Rosebud"
          },
          {
              "geoID": "30063",
              "countyName": "Missoula"
          },
          {
              "geoID": "30071",
              "countyName": "Phillips"
          },
          {
              "geoID": "30007",
              "countyName": "Broadwater"
          },
          {
              "geoID": "30027",
              "countyName": "Fergus"
          },
          {
              "geoID": "30003",
              "countyName": "Big Horn"
          },
          {
              "geoID": "30085",
              "countyName": "Roosevelt"
          },
          {
              "geoID": "30077",
              "countyName": "Powell"
          },
          {
              "geoID": "30095",
              "countyName": "Stillwater"
          },
          {
              "geoID": "30013",
              "countyName": "Cascade"
          }
      ]
  },
  {
      "id": 31,
      "name": "Nebraska",
      "counties": [
          {
              "geoID": "31007",
              "countyName": "Banner"
          },
          {
              "geoID": "31097",
              "countyName": "Johnson"
          },
          {
              "geoID": "31101",
              "countyName": "Keith"
          },
          {
              "geoID": "31105",
              "countyName": "Kimball"
          },
          {
              "geoID": "31145",
              "countyName": "Red Willow"
          },
          {
              "geoID": "31073",
              "countyName": "Gosper"
          },
          {
              "geoID": "31035",
              "countyName": "Clay"
          },
          {
              "geoID": "31011",
              "countyName": "Boone"
          },
          {
              "geoID": "31181",
              "countyName": "Webster"
          },
          {
              "geoID": "31059",
              "countyName": "Fillmore"
          },
          {
              "geoID": "31127",
              "countyName": "Nemaha"
          },
          {
              "geoID": "31001",
              "countyName": "Adams"
          },
          {
              "geoID": "31075",
              "countyName": "Grant"
          },
          {
              "geoID": "31053",
              "countyName": "Dodge"
          },
          {
              "geoID": "31027",
              "countyName": "Cedar"
          },
          {
              "geoID": "31091",
              "countyName": "Hooker"
          },
          {
              "geoID": "31087",
              "countyName": "Hitchcock"
          },
          {
              "geoID": "31157",
              "countyName": "Scotts Bluff"
          },
          {
              "geoID": "31005",
              "countyName": "Arthur"
          },
          {
              "geoID": "31071",
              "countyName": "Garfield"
          },
          {
              "geoID": "31063",
              "countyName": "Frontier"
          },
          {
              "geoID": "31151",
              "countyName": "Saline"
          },
          {
              "geoID": "31185",
              "countyName": "York"
          },
          {
              "geoID": "31123",
              "countyName": "Morrill"
          },
          {
              "geoID": "31067",
              "countyName": "Gage"
          },
          {
              "geoID": "31051",
              "countyName": "Dixon"
          },
          {
              "geoID": "31133",
              "countyName": "Pawnee"
          },
          {
              "geoID": "31033",
              "countyName": "Cheyenne"
          },
          {
              "geoID": "31125",
              "countyName": "Nance"
          },
          {
              "geoID": "31111",
              "countyName": "Lincoln"
          },
          {
              "geoID": "31045",
              "countyName": "Dawes"
          },
          {
              "geoID": "31017",
              "countyName": "Brown"
          },
          {
              "geoID": "31079",
              "countyName": "Hall"
          },
          {
              "geoID": "31147",
              "countyName": "Richardson"
          },
          {
              "geoID": "31179",
              "countyName": "Wayne"
          },
          {
              "geoID": "31173",
              "countyName": "Thurston"
          },
          {
              "geoID": "31041",
              "countyName": "Custer"
          },
          {
              "geoID": "31081",
              "countyName": "Hamilton"
          },
          {
              "geoID": "31115",
              "countyName": "Loup"
          },
          {
              "geoID": "31095",
              "countyName": "Jefferson"
          },
          {
              "geoID": "31003",
              "countyName": "Antelope"
          },
          {
              "geoID": "31119",
              "countyName": "Madison"
          },
          {
              "geoID": "31089",
              "countyName": "Holt"
          },
          {
              "geoID": "31093",
              "countyName": "Howard"
          },
          {
              "geoID": "31099",
              "countyName": "Kearney"
          },
          {
              "geoID": "31023",
              "countyName": "Butler"
          },
          {
              "geoID": "31009",
              "countyName": "Blaine"
          },
          {
              "geoID": "31165",
              "countyName": "Sioux"
          },
          {
              "geoID": "31129",
              "countyName": "Nuckolls"
          },
          {
              "geoID": "31153",
              "countyName": "Sarpy"
          },
          {
              "geoID": "31019",
              "countyName": "Buffalo"
          },
          {
              "geoID": "31155",
              "countyName": "Saunders"
          },
          {
              "geoID": "31085",
              "countyName": "Hayes"
          },
          {
              "geoID": "31135",
              "countyName": "Perkins"
          },
          {
              "geoID": "31139",
              "countyName": "Pierce"
          },
          {
              "geoID": "31141",
              "countyName": "Platte"
          },
          {
              "geoID": "31167",
              "countyName": "Stanton"
          },
          {
              "geoID": "31057",
              "countyName": "Dundy"
          },
          {
              "geoID": "31107",
              "countyName": "Knox"
          },
          {
              "geoID": "31039",
              "countyName": "Cuming"
          },
          {
              "geoID": "31065",
              "countyName": "Furnas"
          },
          {
              "geoID": "31021",
              "countyName": "Burt"
          },
          {
              "geoID": "31169",
              "countyName": "Thayer"
          },
          {
              "geoID": "31031",
              "countyName": "Cherry"
          },
          {
              "geoID": "31037",
              "countyName": "Colfax"
          },
          {
              "geoID": "31103",
              "countyName": "Keya Paha"
          },
          {
              "geoID": "31015",
              "countyName": "Boyd"
          },
          {
              "geoID": "31049",
              "countyName": "Deuel"
          },
          {
              "geoID": "31109",
              "countyName": "Lancaster"
          },
          {
              "geoID": "31055",
              "countyName": "Douglas"
          },
          {
              "geoID": "31161",
              "countyName": "Sheridan"
          },
          {
              "geoID": "31117",
              "countyName": "McPherson"
          },
          {
              "geoID": "31175",
              "countyName": "Valley"
          },
          {
              "geoID": "31143",
              "countyName": "Polk"
          },
          {
              "geoID": "31131",
              "countyName": "Otoe"
          },
          {
              "geoID": "31137",
              "countyName": "Phelps"
          },
          {
              "geoID": "31061",
              "countyName": "Franklin"
          },
          {
              "geoID": "31113",
              "countyName": "Logan"
          },
          {
              "geoID": "31149",
              "countyName": "Rock"
          },
          {
              "geoID": "31183",
              "countyName": "Wheeler"
          },
          {
              "geoID": "31083",
              "countyName": "Harlan"
          },
          {
              "geoID": "31047",
              "countyName": "Dawson"
          },
          {
              "geoID": "31025",
              "countyName": "Cass"
          },
          {
              "geoID": "31121",
              "countyName": "Merrick"
          },
          {
              "geoID": "31043",
              "countyName": "Dakota"
          },
          {
              "geoID": "31171",
              "countyName": "Thomas"
          },
          {
              "geoID": "31177",
              "countyName": "Washington"
          },
          {
              "geoID": "31069",
              "countyName": "Garden"
          },
          {
              "geoID": "31163",
              "countyName": "Sherman"
          },
          {
              "geoID": "31013",
              "countyName": "Box Butte"
          },
          {
              "geoID": "31159",
              "countyName": "Seward"
          },
          {
              "geoID": "31077",
              "countyName": "Greeley"
          },
          {
              "geoID": "31029",
              "countyName": "Chase"
          }
      ]
  },
  {
      "id": 32,
      "name": "Nevada",
      "counties": [
          {
              "geoID": "32029",
              "countyName": "Storey"
          },
          {
              "geoID": "32011",
              "countyName": "Eureka"
          },
          {
              "geoID": "32009",
              "countyName": "Esmeralda"
          },
          {
              "geoID": "32033",
              "countyName": "White Pine"
          },
          {
              "geoID": "32015",
              "countyName": "Lander"
          },
          {
              "geoID": "32017",
              "countyName": "Lincoln"
          },
          {
              "geoID": "32001",
              "countyName": "Churchill"
          },
          {
              "geoID": "32510",
              "countyName": "Carson City"
          },
          {
              "geoID": "32027",
              "countyName": "Pershing"
          },
          {
              "geoID": "32019",
              "countyName": "Lyon"
          },
          {
              "geoID": "32021",
              "countyName": "Mineral"
          },
          {
              "geoID": "32003",
              "countyName": "Clark"
          },
          {
              "geoID": "32007",
              "countyName": "Elko"
          },
          {
              "geoID": "32031",
              "countyName": "Washoe"
          },
          {
              "geoID": "32013",
              "countyName": "Humboldt"
          },
          {
              "geoID": "32023",
              "countyName": "Nye"
          },
          {
              "geoID": "32005",
              "countyName": "Douglas"
          }
      ]
  },
  {
      "id": 33,
      "name": "New Hampshire",
      "counties": [
          {
              "geoID": "33001",
              "countyName": "Belknap"
          },
          {
              "geoID": "33017",
              "countyName": "Strafford"
          },
          {
              "geoID": "33019",
              "countyName": "Sullivan"
          },
          {
              "geoID": "33007",
              "countyName": "Coos"
          },
          {
              "geoID": "33009",
              "countyName": "Grafton"
          },
          {
              "geoID": "33013",
              "countyName": "Merrimack"
          },
          {
              "geoID": "33015",
              "countyName": "Rockingham"
          },
          {
              "geoID": "33005",
              "countyName": "Cheshire"
          },
          {
              "geoID": "33003",
              "countyName": "Carroll"
          },
          {
              "geoID": "33011",
              "countyName": "Hillsborough"
          }
      ]
  },
  {
      "id": 34,
      "name": "New Jersey",
      "counties": [
          {
              "geoID": "34013",
              "countyName": "Essex"
          },
          {
              "geoID": "34019",
              "countyName": "Hunterdon"
          },
          {
              "geoID": "34039",
              "countyName": "Union"
          },
          {
              "geoID": "34017",
              "countyName": "Hudson"
          },
          {
              "geoID": "34015",
              "countyName": "Gloucester"
          },
          {
              "geoID": "34041",
              "countyName": "Warren"
          },
          {
              "geoID": "34023",
              "countyName": "Middlesex"
          },
          {
              "geoID": "34003",
              "countyName": "Bergen"
          },
          {
              "geoID": "34005",
              "countyName": "Burlington"
          },
          {
              "geoID": "34027",
              "countyName": "Morris"
          },
          {
              "geoID": "34021",
              "countyName": "Mercer"
          },
          {
              "geoID": "34035",
              "countyName": "Somerset"
          },
          {
              "geoID": "34025",
              "countyName": "Monmouth"
          },
          {
              "geoID": "34011",
              "countyName": "Cumberland"
          },
          {
              "geoID": "34001",
              "countyName": "Atlantic"
          },
          {
              "geoID": "34037",
              "countyName": "Sussex"
          },
          {
              "geoID": "34009",
              "countyName": "Cape May"
          },
          {
              "geoID": "34033",
              "countyName": "Salem"
          },
          {
              "geoID": "34031",
              "countyName": "Passaic"
          },
          {
              "geoID": "34029",
              "countyName": "Ocean"
          },
          {
              "geoID": "34007",
              "countyName": "Camden"
          }
      ]
  },
  {
      "id": 35,
      "name": "New Mexico",
      "counties": [
          {
              "geoID": "35057",
              "countyName": "Torrance"
          },
          {
              "geoID": "35019",
              "countyName": "Guadalupe"
          },
          {
              "geoID": "35021",
              "countyName": "Harding"
          },
          {
              "geoID": "35041",
              "countyName": "Roosevelt"
          },
          {
              "geoID": "35009",
              "countyName": "Curry"
          },
          {
              "geoID": "35051",
              "countyName": "Sierra"
          },
          {
              "geoID": "35001",
              "countyName": "Bernalillo"
          },
          {
              "geoID": "35027",
              "countyName": "Lincoln"
          },
          {
              "geoID": "35039",
              "countyName": "Rio Arriba"
          },
          {
              "geoID": "35047",
              "countyName": "San Miguel"
          },
          {
              "geoID": "35061",
              "countyName": "Valencia"
          },
          {
              "geoID": "35006",
              "countyName": "Cibola"
          },
          {
              "geoID": "35033",
              "countyName": "Mora"
          },
          {
              "geoID": "35055",
              "countyName": "Taos"
          },
          {
              "geoID": "35031",
              "countyName": "McKinley"
          },
          {
              "geoID": "35053",
              "countyName": "Socorro"
          },
          {
              "geoID": "35028",
              "countyName": "Los Alamos"
          },
          {
              "geoID": "35059",
              "countyName": "Union"
          },
          {
              "geoID": "35035",
              "countyName": "Otero"
          },
          {
              "geoID": "35045",
              "countyName": "San Juan"
          },
          {
              "geoID": "35025",
              "countyName": "Lea"
          },
          {
              "geoID": "35005",
              "countyName": "Chaves"
          },
          {
              "geoID": "35049",
              "countyName": "Santa Fe"
          },
          {
              "geoID": "35017",
              "countyName": "Grant"
          },
          {
              "geoID": "35043",
              "countyName": "Sandoval"
          },
          {
              "geoID": "35037",
              "countyName": "Quay"
          },
          {
              "geoID": "35029",
              "countyName": "Luna"
          },
          {
              "geoID": "35023",
              "countyName": "Hidalgo"
          },
          {
              "geoID": "35003",
              "countyName": "Catron"
          },
          {
              "geoID": "35011",
              "countyName": "De Baca"
          },
          {
              "geoID": "35015",
              "countyName": "Eddy"
          },
          {
              "geoID": "35007",
              "countyName": "Colfax"
          },
          {
              "geoID": "35013",
              "countyName": "Doña Ana"
          }
      ]
  },
  {
      "id": 36,
      "name": "New York",
      "counties": [
          {
              "geoID": "36073",
              "countyName": "Orleans"
          },
          {
              "geoID": "36003",
              "countyName": "Allegany"
          },
          {
              "geoID": "36039",
              "countyName": "Greene"
          },
          {
              "geoID": "36067",
              "countyName": "Onondaga"
          },
          {
              "geoID": "36083",
              "countyName": "Rensselaer"
          },
          {
              "geoID": "36041",
              "countyName": "Hamilton"
          },
          {
              "geoID": "36023",
              "countyName": "Cortland"
          },
          {
              "geoID": "36057",
              "countyName": "Montgomery"
          },
          {
              "geoID": "36053",
              "countyName": "Madison"
          },
          {
              "geoID": "36017",
              "countyName": "Chenango"
          },
          {
              "geoID": "36107",
              "countyName": "Tioga"
          },
          {
              "geoID": "36121",
              "countyName": "Wyoming"
          },
          {
              "geoID": "36079",
              "countyName": "Putnam"
          },
          {
              "geoID": "36101",
              "countyName": "Steuben"
          },
          {
              "geoID": "36055",
              "countyName": "Monroe"
          },
          {
              "geoID": "36021",
              "countyName": "Columbia"
          },
          {
              "geoID": "36011",
              "countyName": "Cayuga"
          },
          {
              "geoID": "36013",
              "countyName": "Chautauqua"
          },
          {
              "geoID": "36099",
              "countyName": "Seneca"
          },
          {
              "geoID": "36065",
              "countyName": "Oneida"
          },
          {
              "geoID": "36077",
              "countyName": "Otsego"
          },
          {
              "geoID": "36029",
              "countyName": "Erie"
          },
          {
              "geoID": "36069",
              "countyName": "Ontario"
          },
          {
              "geoID": "36063",
              "countyName": "Niagara"
          },
          {
              "geoID": "36037",
              "countyName": "Genesee"
          },
          {
              "geoID": "36097",
              "countyName": "Schuyler"
          },
          {
              "geoID": "36045",
              "countyName": "Jefferson"
          },
          {
              "geoID": "36075",
              "countyName": "Oswego"
          },
          {
              "geoID": "36025",
              "countyName": "Delaware"
          },
          {
              "geoID": "36089",
              "countyName": "St. Lawrence"
          },
          {
              "geoID": "36119",
              "countyName": "Westchester"
          },
          {
              "geoID": "36105",
              "countyName": "Sullivan"
          },
          {
              "geoID": "36019",
              "countyName": "Clinton"
          },
          {
              "geoID": "36061",
              "countyName": "New York"
          },
          {
              "geoID": "36095",
              "countyName": "Schoharie"
          },
          {
              "geoID": "36091",
              "countyName": "Saratoga"
          },
          {
              "geoID": "36071",
              "countyName": "Orange"
          },
          {
              "geoID": "36007",
              "countyName": "Broome"
          },
          {
              "geoID": "36115",
              "countyName": "Washington"
          },
          {
              "geoID": "36085",
              "countyName": "Richmond"
          },
          {
              "geoID": "36111",
              "countyName": "Ulster"
          },
          {
              "geoID": "36009",
              "countyName": "Cattaraugus"
          },
          {
              "geoID": "36103",
              "countyName": "Suffolk"
          },
          {
              "geoID": "36005",
              "countyName": "Bronx"
          },
          {
              "geoID": "36031",
              "countyName": "Essex"
          },
          {
              "geoID": "36035",
              "countyName": "Fulton"
          },
          {
              "geoID": "36087",
              "countyName": "Rockland"
          },
          {
              "geoID": "36043",
              "countyName": "Herkimer"
          },
          {
              "geoID": "36113",
              "countyName": "Warren"
          },
          {
              "geoID": "36047",
              "countyName": "Kings"
          },
          {
              "geoID": "36059",
              "countyName": "Nassau"
          },
          {
              "geoID": "36093",
              "countyName": "Schenectady"
          },
          {
              "geoID": "36015",
              "countyName": "Chemung"
          },
          {
              "geoID": "36001",
              "countyName": "Albany"
          },
          {
              "geoID": "36051",
              "countyName": "Livingston"
          },
          {
              "geoID": "36033",
              "countyName": "Franklin"
          },
          {
              "geoID": "36117",
              "countyName": "Wayne"
          },
          {
              "geoID": "36049",
              "countyName": "Lewis"
          },
          {
              "geoID": "36081",
              "countyName": "Queens"
          },
          {
              "geoID": "36123",
              "countyName": "Yates"
          },
          {
              "geoID": "36109",
              "countyName": "Tompkins"
          },
          {
              "geoID": "36027",
              "countyName": "Dutchess"
          }
      ]
  },
  {
      "id": 37,
      "name": "North Carolina",
      "counties": [
          {
              "geoID": "37181",
              "countyName": "Vance"
          },
          {
              "geoID": "37107",
              "countyName": "Lenoir"
          },
          {
              "geoID": "37147",
              "countyName": "Pitt"
          },
          {
              "geoID": "37081",
              "countyName": "Guilford"
          },
          {
              "geoID": "37093",
              "countyName": "Hoke"
          },
          {
              "geoID": "37195",
              "countyName": "Wilson"
          },
          {
              "geoID": "37129",
              "countyName": "New Hanover"
          },
          {
              "geoID": "37159",
              "countyName": "Rowan"
          },
          {
              "geoID": "37037",
              "countyName": "Chatham"
          },
          {
              "geoID": "37027",
              "countyName": "Caldwell"
          },
          {
              "geoID": "37085",
              "countyName": "Harnett"
          },
          {
              "geoID": "37105",
              "countyName": "Lee"
          },
          {
              "geoID": "37153",
              "countyName": "Richmond"
          },
          {
              "geoID": "37057",
              "countyName": "Davidson"
          },
          {
              "geoID": "37171",
              "countyName": "Surry"
          },
          {
              "geoID": "37103",
              "countyName": "Jones"
          },
          {
              "geoID": "37029",
              "countyName": "Camden"
          },
          {
              "geoID": "37043",
              "countyName": "Clay"
          },
          {
              "geoID": "37133",
              "countyName": "Onslow"
          },
          {
              "geoID": "37025",
              "countyName": "Cabarrus"
          },
          {
              "geoID": "37059",
              "countyName": "Davie"
          },
          {
              "geoID": "37165",
              "countyName": "Scotland"
          },
          {
              "geoID": "37111",
              "countyName": "McDowell"
          },
          {
              "geoID": "37179",
              "countyName": "Union"
          },
          {
              "geoID": "37151",
              "countyName": "Randolph"
          },
          {
              "geoID": "37083",
              "countyName": "Halifax"
          },
          {
              "geoID": "37197",
              "countyName": "Yadkin"
          },
          {
              "geoID": "37199",
              "countyName": "Yancey"
          },
          {
              "geoID": "37109",
              "countyName": "Lincoln"
          },
          {
              "geoID": "37047",
              "countyName": "Columbus"
          },
          {
              "geoID": "37075",
              "countyName": "Graham"
          },
          {
              "geoID": "37137",
              "countyName": "Pamlico"
          },
          {
              "geoID": "37065",
              "countyName": "Edgecombe"
          },
          {
              "geoID": "37079",
              "countyName": "Greene"
          },
          {
              "geoID": "37063",
              "countyName": "Durham"
          },
          {
              "geoID": "37135",
              "countyName": "Orange"
          },
          {
              "geoID": "37121",
              "countyName": "Mitchell"
          },
          {
              "geoID": "37089",
              "countyName": "Henderson"
          },
          {
              "geoID": "37149",
              "countyName": "Polk"
          },
          {
              "geoID": "37011",
              "countyName": "Avery"
          },
          {
              "geoID": "37125",
              "countyName": "Moore"
          },
          {
              "geoID": "37101",
              "countyName": "Johnston"
          },
          {
              "geoID": "37127",
              "countyName": "Nash"
          },
          {
              "geoID": "37035",
              "countyName": "Catawba"
          },
          {
              "geoID": "37007",
              "countyName": "Anson"
          },
          {
              "geoID": "37189",
              "countyName": "Watauga"
          },
          {
              "geoID": "37091",
              "countyName": "Hertford"
          },
          {
              "geoID": "37061",
              "countyName": "Duplin"
          },
          {
              "geoID": "37117",
              "countyName": "Martin"
          },
          {
              "geoID": "37191",
              "countyName": "Wayne"
          },
          {
              "geoID": "37015",
              "countyName": "Bertie"
          },
          {
              "geoID": "37017",
              "countyName": "Bladen"
          },
          {
              "geoID": "37041",
              "countyName": "Chowan"
          },
          {
              "geoID": "37143",
              "countyName": "Perquimans"
          },
          {
              "geoID": "37055",
              "countyName": "Dare"
          },
          {
              "geoID": "37053",
              "countyName": "Currituck"
          },
          {
              "geoID": "37077",
              "countyName": "Granville"
          },
          {
              "geoID": "37169",
              "countyName": "Stokes"
          },
          {
              "geoID": "37185",
              "countyName": "Warren"
          },
          {
              "geoID": "37021",
              "countyName": "Buncombe"
          },
          {
              "geoID": "37023",
              "countyName": "Burke"
          },
          {
              "geoID": "37071",
              "countyName": "Gaston"
          },
          {
              "geoID": "37115",
              "countyName": "Madison"
          },
          {
              "geoID": "37039",
              "countyName": "Cherokee"
          },
          {
              "geoID": "37097",
              "countyName": "Iredell"
          },
          {
              "geoID": "37183",
              "countyName": "Wake"
          },
          {
              "geoID": "37193",
              "countyName": "Wilkes"
          },
          {
              "geoID": "37123",
              "countyName": "Montgomery"
          },
          {
              "geoID": "37161",
              "countyName": "Rutherford"
          },
          {
              "geoID": "37177",
              "countyName": "Tyrrell"
          },
          {
              "geoID": "37087",
              "countyName": "Haywood"
          },
          {
              "geoID": "37049",
              "countyName": "Craven"
          },
          {
              "geoID": "37175",
              "countyName": "Transylvania"
          },
          {
              "geoID": "37145",
              "countyName": "Person"
          },
          {
              "geoID": "37051",
              "countyName": "Cumberland"
          },
          {
              "geoID": "37139",
              "countyName": "Pasquotank"
          },
          {
              "geoID": "37003",
              "countyName": "Alexander"
          },
          {
              "geoID": "37073",
              "countyName": "Gates"
          },
          {
              "geoID": "37131",
              "countyName": "Northampton"
          },
          {
              "geoID": "37141",
              "countyName": "Pender"
          },
          {
              "geoID": "37031",
              "countyName": "Carteret"
          },
          {
              "geoID": "37001",
              "countyName": "Alamance"
          },
          {
              "geoID": "37069",
              "countyName": "Franklin"
          },
          {
              "geoID": "37009",
              "countyName": "Ashe"
          },
          {
              "geoID": "37099",
              "countyName": "Jackson"
          },
          {
              "geoID": "37045",
              "countyName": "Cleveland"
          },
          {
              "geoID": "37163",
              "countyName": "Sampson"
          },
          {
              "geoID": "37013",
              "countyName": "Beaufort"
          },
          {
              "geoID": "37095",
              "countyName": "Hyde"
          },
          {
              "geoID": "37067",
              "countyName": "Forsyth"
          },
          {
              "geoID": "37119",
              "countyName": "Mecklenburg"
          },
          {
              "geoID": "37187",
              "countyName": "Washington"
          },
          {
              "geoID": "37113",
              "countyName": "Macon"
          },
          {
              "geoID": "37005",
              "countyName": "Alleghany"
          },
          {
              "geoID": "37155",
              "countyName": "Robeson"
          },
          {
              "geoID": "37157",
              "countyName": "Rockingham"
          },
          {
              "geoID": "37173",
              "countyName": "Swain"
          },
          {
              "geoID": "37033",
              "countyName": "Caswell"
          },
          {
              "geoID": "37019",
              "countyName": "Brunswick"
          },
          {
              "geoID": "37167",
              "countyName": "Stanly"
          }
      ]
  },
  {
      "id": 38,
      "name": "North Dakota",
      "counties": [
          {
              "geoID": "38043",
              "countyName": "Kidder"
          },
          {
              "geoID": "38057",
              "countyName": "Mercer"
          },
          {
              "geoID": "38065",
              "countyName": "Oliver"
          },
          {
              "geoID": "38067",
              "countyName": "Pembina"
          },
          {
              "geoID": "38017",
              "countyName": "Cass"
          },
          {
              "geoID": "38003",
              "countyName": "Barnes"
          },
          {
              "geoID": "38101",
              "countyName": "Ward"
          },
          {
              "geoID": "38019",
              "countyName": "Cavalier"
          },
          {
              "geoID": "38083",
              "countyName": "Sheridan"
          },
          {
              "geoID": "38069",
              "countyName": "Pierce"
          },
          {
              "geoID": "38103",
              "countyName": "Wells"
          },
          {
              "geoID": "38011",
              "countyName": "Bowman"
          },
          {
              "geoID": "38039",
              "countyName": "Griggs"
          },
          {
              "geoID": "38031",
              "countyName": "Foster"
          },
          {
              "geoID": "38045",
              "countyName": "LaMoure"
          },
          {
              "geoID": "38097",
              "countyName": "Traill"
          },
          {
              "geoID": "38037",
              "countyName": "Grant"
          },
          {
              "geoID": "38073",
              "countyName": "Ransom"
          },
          {
              "geoID": "38025",
              "countyName": "Dunn"
          },
          {
              "geoID": "38009",
              "countyName": "Bottineau"
          },
          {
              "geoID": "38021",
              "countyName": "Dickey"
          },
          {
              "geoID": "38033",
              "countyName": "Golden Valley"
          },
          {
              "geoID": "38029",
              "countyName": "Emmons"
          },
          {
              "geoID": "38075",
              "countyName": "Renville"
          },
          {
              "geoID": "38105",
              "countyName": "Williams"
          },
          {
              "geoID": "38005",
              "countyName": "Benson"
          },
          {
              "geoID": "38071",
              "countyName": "Ramsey"
          },
          {
              "geoID": "38061",
              "countyName": "Mountrail"
          },
          {
              "geoID": "38055",
              "countyName": "McLean"
          },
          {
              "geoID": "38015",
              "countyName": "Burleigh"
          },
          {
              "geoID": "38085",
              "countyName": "Sioux"
          },
          {
              "geoID": "38051",
              "countyName": "McIntosh"
          },
          {
              "geoID": "38095",
              "countyName": "Towner"
          },
          {
              "geoID": "38091",
              "countyName": "Steele"
          },
          {
              "geoID": "38081",
              "countyName": "Sargent"
          },
          {
              "geoID": "38007",
              "countyName": "Billings"
          },
          {
              "geoID": "38049",
              "countyName": "McHenry"
          },
          {
              "geoID": "38041",
              "countyName": "Hettinger"
          },
          {
              "geoID": "38053",
              "countyName": "McKenzie"
          },
          {
              "geoID": "38079",
              "countyName": "Rolette"
          },
          {
              "geoID": "38089",
              "countyName": "Stark"
          },
          {
              "geoID": "38063",
              "countyName": "Nelson"
          },
          {
              "geoID": "38023",
              "countyName": "Divide"
          },
          {
              "geoID": "38035",
              "countyName": "Grand Forks"
          },
          {
              "geoID": "38047",
              "countyName": "Logan"
          },
          {
              "geoID": "38099",
              "countyName": "Walsh"
          },
          {
              "geoID": "38013",
              "countyName": "Burke"
          },
          {
              "geoID": "38093",
              "countyName": "Stutsman"
          },
          {
              "geoID": "38087",
              "countyName": "Slope"
          },
          {
              "geoID": "38001",
              "countyName": "Adams"
          },
          {
              "geoID": "38077",
              "countyName": "Richland"
          },
          {
              "geoID": "38027",
              "countyName": "Eddy"
          },
          {
              "geoID": "38059",
              "countyName": "Morton"
          }
      ]
  },
  {
      "id": 39,
      "name": "Ohio",
      "counties": [
          {
              "geoID": "39093",
              "countyName": "Lorain"
          },
          {
              "geoID": "39055",
              "countyName": "Geauga"
          },
          {
              "geoID": "39087",
              "countyName": "Lawrence"
          },
          {
              "geoID": "39003",
              "countyName": "Allen"
          },
          {
              "geoID": "39059",
              "countyName": "Guernsey"
          },
          {
              "geoID": "39135",
              "countyName": "Preble"
          },
          {
              "geoID": "39007",
              "countyName": "Ashtabula"
          },
          {
              "geoID": "39099",
              "countyName": "Mahoning"
          },
          {
              "geoID": "39109",
              "countyName": "Miami"
          },
          {
              "geoID": "39119",
              "countyName": "Muskingum"
          },
          {
              "geoID": "39121",
              "countyName": "Noble"
          },
          {
              "geoID": "39155",
              "countyName": "Trumbull"
          },
          {
              "geoID": "39025",
              "countyName": "Clermont"
          },
          {
              "geoID": "39027",
              "countyName": "Clinton"
          },
          {
              "geoID": "39071",
              "countyName": "Highland"
          },
          {
              "geoID": "39005",
              "countyName": "Ashland"
          },
          {
              "geoID": "39129",
              "countyName": "Pickaway"
          },
          {
              "geoID": "39131",
              "countyName": "Pike"
          },
          {
              "geoID": "39049",
              "countyName": "Franklin"
          },
          {
              "geoID": "39091",
              "countyName": "Logan"
          },
          {
              "geoID": "39053",
              "countyName": "Gallia"
          },
          {
              "geoID": "39171",
              "countyName": "Williams"
          },
          {
              "geoID": "39097",
              "countyName": "Madison"
          },
          {
              "geoID": "39173",
              "countyName": "Wood"
          },
          {
              "geoID": "39141",
              "countyName": "Ross"
          },
          {
              "geoID": "39143",
              "countyName": "Sandusky"
          },
          {
              "geoID": "39105",
              "countyName": "Meigs"
          },
          {
              "geoID": "39057",
              "countyName": "Greene"
          },
          {
              "geoID": "39085",
              "countyName": "Lake"
          },
          {
              "geoID": "39019",
              "countyName": "Carroll"
          },
          {
              "geoID": "39145",
              "countyName": "Scioto"
          },
          {
              "geoID": "39029",
              "countyName": "Columbiana"
          },
          {
              "geoID": "39175",
              "countyName": "Wyandot"
          },
          {
              "geoID": "39041",
              "countyName": "Delaware"
          },
          {
              "geoID": "39015",
              "countyName": "Brown"
          },
          {
              "geoID": "39101",
              "countyName": "Marion"
          },
          {
              "geoID": "39013",
              "countyName": "Belmont"
          },
          {
              "geoID": "39061",
              "countyName": "Hamilton"
          },
          {
              "geoID": "39079",
              "countyName": "Jackson"
          },
          {
              "geoID": "39011",
              "countyName": "Auglaize"
          },
          {
              "geoID": "39051",
              "countyName": "Fulton"
          },
          {
              "geoID": "39089",
              "countyName": "Licking"
          },
          {
              "geoID": "39069",
              "countyName": "Henry"
          },
          {
              "geoID": "39021",
              "countyName": "Champaign"
          },
          {
              "geoID": "39045",
              "countyName": "Fairfield"
          },
          {
              "geoID": "39065",
              "countyName": "Hardin"
          },
          {
              "geoID": "39115",
              "countyName": "Morgan"
          },
          {
              "geoID": "39075",
              "countyName": "Holmes"
          },
          {
              "geoID": "39103",
              "countyName": "Medina"
          },
          {
              "geoID": "39095",
              "countyName": "Lucas"
          },
          {
              "geoID": "39117",
              "countyName": "Morrow"
          },
          {
              "geoID": "39081",
              "countyName": "Jefferson"
          },
          {
              "geoID": "39151",
              "countyName": "Stark"
          },
          {
              "geoID": "39067",
              "countyName": "Harrison"
          },
          {
              "geoID": "39123",
              "countyName": "Ottawa"
          },
          {
              "geoID": "39157",
              "countyName": "Tuscarawas"
          },
          {
              "geoID": "39165",
              "countyName": "Warren"
          },
          {
              "geoID": "39169",
              "countyName": "Wayne"
          },
          {
              "geoID": "39033",
              "countyName": "Crawford"
          },
          {
              "geoID": "39063",
              "countyName": "Hancock"
          },
          {
              "geoID": "39073",
              "countyName": "Hocking"
          },
          {
              "geoID": "39083",
              "countyName": "Knox"
          },
          {
              "geoID": "39023",
              "countyName": "Clark"
          },
          {
              "geoID": "39147",
              "countyName": "Seneca"
          },
          {
              "geoID": "39163",
              "countyName": "Vinton"
          },
          {
              "geoID": "39047",
              "countyName": "Fayette"
          },
          {
              "geoID": "39133",
              "countyName": "Portage"
          },
          {
              "geoID": "39113",
              "countyName": "Montgomery"
          },
          {
              "geoID": "39139",
              "countyName": "Richland"
          },
          {
              "geoID": "39111",
              "countyName": "Monroe"
          },
          {
              "geoID": "39077",
              "countyName": "Huron"
          },
          {
              "geoID": "39009",
              "countyName": "Athens"
          },
          {
              "geoID": "39039",
              "countyName": "Defiance"
          },
          {
              "geoID": "39031",
              "countyName": "Coshocton"
          },
          {
              "geoID": "39167",
              "countyName": "Washington"
          },
          {
              "geoID": "39107",
              "countyName": "Mercer"
          },
          {
              "geoID": "39149",
              "countyName": "Shelby"
          },
          {
              "geoID": "39127",
              "countyName": "Perry"
          },
          {
              "geoID": "39043",
              "countyName": "Erie"
          },
          {
              "geoID": "39161",
              "countyName": "Van Wert"
          },
          {
              "geoID": "39125",
              "countyName": "Paulding"
          },
          {
              "geoID": "39037",
              "countyName": "Darke"
          },
          {
              "geoID": "39017",
              "countyName": "Butler"
          },
          {
              "geoID": "39159",
              "countyName": "Union"
          },
          {
              "geoID": "39137",
              "countyName": "Putnam"
          },
          {
              "geoID": "39153",
              "countyName": "Summit"
          },
          {
              "geoID": "39035",
              "countyName": "Cuyahoga"
          },
          {
              "geoID": "39001",
              "countyName": "Adams"
          }
      ]
  },
  {
      "id": 40,
      "name": "Oklahoma",
      "counties": [
          {
              "geoID": "40015",
              "countyName": "Caddo"
          },
          {
              "geoID": "40031",
              "countyName": "Comanche"
          },
          {
              "geoID": "40059",
              "countyName": "Harper"
          },
          {
              "geoID": "40003",
              "countyName": "Alfalfa"
          },
          {
              "geoID": "40115",
              "countyName": "Ottawa"
          },
          {
              "geoID": "40001",
              "countyName": "Adair"
          },
          {
              "geoID": "40051",
              "countyName": "Grady"
          },
          {
              "geoID": "40017",
              "countyName": "Canadian"
          },
          {
              "geoID": "40027",
              "countyName": "Cleveland"
          },
          {
              "geoID": "40151",
              "countyName": "Woods"
          },
          {
              "geoID": "40047",
              "countyName": "Garfield"
          },
          {
              "geoID": "40105",
              "countyName": "Nowata"
          },
          {
              "geoID": "40011",
              "countyName": "Blaine"
          },
          {
              "geoID": "40133",
              "countyName": "Seminole"
          },
          {
              "geoID": "40125",
              "countyName": "Pottawatomie"
          },
          {
              "geoID": "40077",
              "countyName": "Latimer"
          },
          {
              "geoID": "40087",
              "countyName": "McClain"
          },
          {
              "geoID": "40069",
              "countyName": "Johnston"
          },
          {
              "geoID": "40075",
              "countyName": "Kiowa"
          },
          {
              "geoID": "40093",
              "countyName": "Major"
          },
          {
              "geoID": "40035",
              "countyName": "Craig"
          },
          {
              "geoID": "40129",
              "countyName": "Roger Mills"
          },
          {
              "geoID": "40009",
              "countyName": "Beckham"
          },
          {
              "geoID": "40143",
              "countyName": "Tulsa"
          },
          {
              "geoID": "40043",
              "countyName": "Dewey"
          },
          {
              "geoID": "40039",
              "countyName": "Custer"
          },
          {
              "geoID": "40121",
              "countyName": "Pittsburg"
          },
          {
              "geoID": "40013",
              "countyName": "Bryan"
          },
          {
              "geoID": "40053",
              "countyName": "Grant"
          },
          {
              "geoID": "40139",
              "countyName": "Texas"
          },
          {
              "geoID": "40145",
              "countyName": "Wagoner"
          },
          {
              "geoID": "40107",
              "countyName": "Okfuskee"
          },
          {
              "geoID": "40111",
              "countyName": "Okmulgee"
          },
          {
              "geoID": "40065",
              "countyName": "Jackson"
          },
          {
              "geoID": "40067",
              "countyName": "Jefferson"
          },
          {
              "geoID": "40141",
              "countyName": "Tillman"
          },
          {
              "geoID": "40083",
              "countyName": "Logan"
          },
          {
              "geoID": "40049",
              "countyName": "Garvin"
          },
          {
              "geoID": "40109",
              "countyName": "Oklahoma"
          },
          {
              "geoID": "40113",
              "countyName": "Osage"
          },
          {
              "geoID": "40117",
              "countyName": "Pawnee"
          },
          {
              "geoID": "40005",
              "countyName": "Atoka"
          },
          {
              "geoID": "40023",
              "countyName": "Choctaw"
          },
          {
              "geoID": "40063",
              "countyName": "Hughes"
          },
          {
              "geoID": "40091",
              "countyName": "McIntosh"
          },
          {
              "geoID": "40061",
              "countyName": "Haskell"
          },
          {
              "geoID": "40079",
              "countyName": "Le Flore"
          },
          {
              "geoID": "40101",
              "countyName": "Muskogee"
          },
          {
              "geoID": "40135",
              "countyName": "Sequoyah"
          },
          {
              "geoID": "40041",
              "countyName": "Delaware"
          },
          {
              "geoID": "40089",
              "countyName": "McCurtain"
          },
          {
              "geoID": "40057",
              "countyName": "Harmon"
          },
          {
              "geoID": "40085",
              "countyName": "Love"
          },
          {
              "geoID": "40019",
              "countyName": "Carter"
          },
          {
              "geoID": "40147",
              "countyName": "Washington"
          },
          {
              "geoID": "40007",
              "countyName": "Beaver"
          },
          {
              "geoID": "40123",
              "countyName": "Pontotoc"
          },
          {
              "geoID": "40029",
              "countyName": "Coal"
          },
          {
              "geoID": "40033",
              "countyName": "Cotton"
          },
          {
              "geoID": "40071",
              "countyName": "Kay"
          },
          {
              "geoID": "40055",
              "countyName": "Greer"
          },
          {
              "geoID": "40127",
              "countyName": "Pushmataha"
          },
          {
              "geoID": "40097",
              "countyName": "Mayes"
          },
          {
              "geoID": "40073",
              "countyName": "Kingfisher"
          },
          {
              "geoID": "40131",
              "countyName": "Rogers"
          },
          {
              "geoID": "40103",
              "countyName": "Noble"
          },
          {
              "geoID": "40149",
              "countyName": "Washita"
          },
          {
              "geoID": "40021",
              "countyName": "Cherokee"
          },
          {
              "geoID": "40025",
              "countyName": "Cimarron"
          },
          {
              "geoID": "40095",
              "countyName": "Marshall"
          },
          {
              "geoID": "40099",
              "countyName": "Murray"
          },
          {
              "geoID": "40153",
              "countyName": "Woodward"
          },
          {
              "geoID": "40081",
              "countyName": "Lincoln"
          },
          {
              "geoID": "40037",
              "countyName": "Creek"
          },
          {
              "geoID": "40137",
              "countyName": "Stephens"
          },
          {
              "geoID": "40045",
              "countyName": "Ellis"
          },
          {
              "geoID": "40119",
              "countyName": "Payne"
          }
      ]
  },
  {
      "id": 41,
      "name": "Oregon",
      "counties": [
          {
              "geoID": "41027",
              "countyName": "Hood River"
          },
          {
              "geoID": "41003",
              "countyName": "Benton"
          },
          {
              "geoID": "41067",
              "countyName": "Washington"
          },
          {
              "geoID": "41031",
              "countyName": "Jefferson"
          },
          {
              "geoID": "41023",
              "countyName": "Grant"
          },
          {
              "geoID": "41033",
              "countyName": "Josephine"
          },
          {
              "geoID": "41039",
              "countyName": "Lane"
          },
          {
              "geoID": "41009",
              "countyName": "Columbia"
          },
          {
              "geoID": "41059",
              "countyName": "Umatilla"
          },
          {
              "geoID": "41045",
              "countyName": "Malheur"
          },
          {
              "geoID": "41041",
              "countyName": "Lincoln"
          },
          {
              "geoID": "41069",
              "countyName": "Wheeler"
          },
          {
              "geoID": "41005",
              "countyName": "Clackamas"
          },
          {
              "geoID": "41061",
              "countyName": "Union"
          },
          {
              "geoID": "41015",
              "countyName": "Curry"
          },
          {
              "geoID": "41057",
              "countyName": "Tillamook"
          },
          {
              "geoID": "41051",
              "countyName": "Multnomah"
          },
          {
              "geoID": "41013",
              "countyName": "Crook"
          },
          {
              "geoID": "41029",
              "countyName": "Jackson"
          },
          {
              "geoID": "41055",
              "countyName": "Sherman"
          },
          {
              "geoID": "41037",
              "countyName": "Lake"
          },
          {
              "geoID": "41047",
              "countyName": "Marion"
          },
          {
              "geoID": "41011",
              "countyName": "Coos"
          },
          {
              "geoID": "41017",
              "countyName": "Deschutes"
          },
          {
              "geoID": "41021",
              "countyName": "Gilliam"
          },
          {
              "geoID": "41001",
              "countyName": "Baker"
          },
          {
              "geoID": "41007",
              "countyName": "Clatsop"
          },
          {
              "geoID": "41065",
              "countyName": "Wasco"
          },
          {
              "geoID": "41019",
              "countyName": "Douglas"
          },
          {
              "geoID": "41025",
              "countyName": "Harney"
          },
          {
              "geoID": "41053",
              "countyName": "Polk"
          },
          {
              "geoID": "41035",
              "countyName": "Klamath"
          },
          {
              "geoID": "41043",
              "countyName": "Linn"
          },
          {
              "geoID": "41063",
              "countyName": "Wallowa"
          },
          {
              "geoID": "41049",
              "countyName": "Morrow"
          },
          {
              "geoID": "41071",
              "countyName": "Yamhill"
          }
      ]
  },
  {
      "id": 42,
      "name": "Pennsylvania",
      "counties": [
          {
              "geoID": "42075",
              "countyName": "Lebanon"
          },
          {
              "geoID": "42097",
              "countyName": "Northumberland"
          },
          {
              "geoID": "42025",
              "countyName": "Carbon"
          },
          {
              "geoID": "42121",
              "countyName": "Venango"
          },
          {
              "geoID": "42023",
              "countyName": "Cameron"
          },
          {
              "geoID": "42053",
              "countyName": "Forest"
          },
          {
              "geoID": "42069",
              "countyName": "Lackawanna"
          },
          {
              "geoID": "42083",
              "countyName": "McKean"
          },
          {
              "geoID": "42093",
              "countyName": "Montour"
          },
          {
              "geoID": "42125",
              "countyName": "Washington"
          },
          {
              "geoID": "42113",
              "countyName": "Sullivan"
          },
          {
              "geoID": "42001",
              "countyName": "Adams"
          },
          {
              "geoID": "42037",
              "countyName": "Columbia"
          },
          {
              "geoID": "42115",
              "countyName": "Susquehanna"
          },
          {
              "geoID": "42101",
              "countyName": "Philadelphia"
          },
          {
              "geoID": "42021",
              "countyName": "Cambria"
          },
          {
              "geoID": "42027",
              "countyName": "Centre"
          },
          {
              "geoID": "42123",
              "countyName": "Warren"
          },
          {
              "geoID": "42079",
              "countyName": "Luzerne"
          },
          {
              "geoID": "42129",
              "countyName": "Westmoreland"
          },
          {
              "geoID": "42107",
              "countyName": "Schuylkill"
          },
          {
              "geoID": "42045",
              "countyName": "Delaware"
          },
          {
              "geoID": "42131",
              "countyName": "Wyoming"
          },
          {
              "geoID": "42059",
              "countyName": "Greene"
          },
          {
              "geoID": "42031",
              "countyName": "Clarion"
          },
          {
              "geoID": "42103",
              "countyName": "Pike"
          },
          {
              "geoID": "42091",
              "countyName": "Montgomery"
          },
          {
              "geoID": "42057",
              "countyName": "Fulton"
          },
          {
              "geoID": "42047",
              "countyName": "Elk"
          },
          {
              "geoID": "42061",
              "countyName": "Huntingdon"
          },
          {
              "geoID": "42067",
              "countyName": "Juniata"
          },
          {
              "geoID": "42071",
              "countyName": "Lancaster"
          },
          {
              "geoID": "42087",
              "countyName": "Mifflin"
          },
          {
              "geoID": "42019",
              "countyName": "Butler"
          },
          {
              "geoID": "42043",
              "countyName": "Dauphin"
          },
          {
              "geoID": "42127",
              "countyName": "Wayne"
          },
          {
              "geoID": "42109",
              "countyName": "Snyder"
          },
          {
              "geoID": "42007",
              "countyName": "Beaver"
          },
          {
              "geoID": "42039",
              "countyName": "Crawford"
          },
          {
              "geoID": "42009",
              "countyName": "Bedford"
          },
          {
              "geoID": "42133",
              "countyName": "York"
          },
          {
              "geoID": "42033",
              "countyName": "Clearfield"
          },
          {
              "geoID": "42017",
              "countyName": "Bucks"
          },
          {
              "geoID": "42035",
              "countyName": "Clinton"
          },
          {
              "geoID": "42119",
              "countyName": "Union"
          },
          {
              "geoID": "42041",
              "countyName": "Cumberland"
          },
          {
              "geoID": "42003",
              "countyName": "Allegheny"
          },
          {
              "geoID": "42077",
              "countyName": "Lehigh"
          },
          {
              "geoID": "42065",
              "countyName": "Jefferson"
          },
          {
              "geoID": "42055",
              "countyName": "Franklin"
          },
          {
              "geoID": "42049",
              "countyName": "Erie"
          },
          {
              "geoID": "42081",
              "countyName": "Lycoming"
          },
          {
              "geoID": "42011",
              "countyName": "Berks"
          },
          {
              "geoID": "42089",
              "countyName": "Monroe"
          },
          {
              "geoID": "42051",
              "countyName": "Fayette"
          },
          {
              "geoID": "42073",
              "countyName": "Lawrence"
          },
          {
              "geoID": "42015",
              "countyName": "Bradford"
          },
          {
              "geoID": "42095",
              "countyName": "Northampton"
          },
          {
              "geoID": "42085",
              "countyName": "Mercer"
          },
          {
              "geoID": "42117",
              "countyName": "Tioga"
          },
          {
              "geoID": "42111",
              "countyName": "Somerset"
          },
          {
              "geoID": "42105",
              "countyName": "Potter"
          },
          {
              "geoID": "42013",
              "countyName": "Blair"
          },
          {
              "geoID": "42029",
              "countyName": "Chester"
          },
          {
              "geoID": "42099",
              "countyName": "Perry"
          },
          {
              "geoID": "42063",
              "countyName": "Indiana"
          },
          {
              "geoID": "42005",
              "countyName": "Armstrong"
          }
      ]
  },
  {
      "id": 44,
      "name": "Rhode Island",
      "counties": [
          {
              "geoID": "44001",
              "countyName": "Bristol"
          },
          {
              "geoID": "44007",
              "countyName": "Providence"
          },
          {
              "geoID": "44009",
              "countyName": "Washington"
          },
          {
              "geoID": "44005",
              "countyName": "Newport"
          },
          {
              "geoID": "44003",
              "countyName": "Kent"
          }
      ]
  },
  {
      "id": 45,
      "name": "South Carolina",
      "counties": [
          {
              "geoID": "45077",
              "countyName": "Pickens"
          },
          {
              "geoID": "45059",
              "countyName": "Laurens"
          },
          {
              "geoID": "45063",
              "countyName": "Lexington"
          },
          {
              "geoID": "45011",
              "countyName": "Barnwell"
          },
          {
              "geoID": "45023",
              "countyName": "Chester"
          },
          {
              "geoID": "45003",
              "countyName": "Aiken"
          },
          {
              "geoID": "45001",
              "countyName": "Abbeville"
          },
          {
              "geoID": "45015",
              "countyName": "Berkeley"
          },
          {
              "geoID": "45027",
              "countyName": "Clarendon"
          },
          {
              "geoID": "45079",
              "countyName": "Richland"
          },
          {
              "geoID": "45083",
              "countyName": "Spartanburg"
          },
          {
              "geoID": "45007",
              "countyName": "Anderson"
          },
          {
              "geoID": "45073",
              "countyName": "Oconee"
          },
          {
              "geoID": "45065",
              "countyName": "McCormick"
          },
          {
              "geoID": "45029",
              "countyName": "Colleton"
          },
          {
              "geoID": "45005",
              "countyName": "Allendale"
          },
          {
              "geoID": "45009",
              "countyName": "Bamberg"
          },
          {
              "geoID": "45019",
              "countyName": "Charleston"
          },
          {
              "geoID": "45035",
              "countyName": "Dorchester"
          },
          {
              "geoID": "45021",
              "countyName": "Cherokee"
          },
          {
              "geoID": "45025",
              "countyName": "Chesterfield"
          },
          {
              "geoID": "45031",
              "countyName": "Darlington"
          },
          {
              "geoID": "45039",
              "countyName": "Fairfield"
          },
          {
              "geoID": "45047",
              "countyName": "Greenwood"
          },
          {
              "geoID": "45049",
              "countyName": "Hampton"
          },
          {
              "geoID": "45057",
              "countyName": "Lancaster"
          },
          {
              "geoID": "45045",
              "countyName": "Greenville"
          },
          {
              "geoID": "45061",
              "countyName": "Lee"
          },
          {
              "geoID": "45067",
              "countyName": "Marion"
          },
          {
              "geoID": "45075",
              "countyName": "Orangeburg"
          },
          {
              "geoID": "45071",
              "countyName": "Newberry"
          },
          {
              "geoID": "45087",
              "countyName": "Union"
          },
          {
              "geoID": "45091",
              "countyName": "York"
          },
          {
              "geoID": "45037",
              "countyName": "Edgefield"
          },
          {
              "geoID": "45085",
              "countyName": "Sumter"
          },
          {
              "geoID": "45013",
              "countyName": "Beaufort"
          },
          {
              "geoID": "45043",
              "countyName": "Georgetown"
          },
          {
              "geoID": "45051",
              "countyName": "Horry"
          },
          {
              "geoID": "45089",
              "countyName": "Williamsburg"
          },
          {
              "geoID": "45041",
              "countyName": "Florence"
          },
          {
              "geoID": "45033",
              "countyName": "Dillon"
          },
          {
              "geoID": "45069",
              "countyName": "Marlboro"
          },
          {
              "geoID": "45053",
              "countyName": "Jasper"
          },
          {
              "geoID": "45081",
              "countyName": "Saluda"
          },
          {
              "geoID": "45055",
              "countyName": "Kershaw"
          },
          {
              "geoID": "45017",
              "countyName": "Calhoun"
          }
      ]
  },
  {
      "id": 46,
      "name": "South Dakota",
      "counties": [
          {
              "geoID": "46051",
              "countyName": "Grant"
          },
          {
              "geoID": "46003",
              "countyName": "Aurora"
          },
          {
              "geoID": "46061",
              "countyName": "Hanson"
          },
          {
              "geoID": "46097",
              "countyName": "Miner"
          },
          {
              "geoID": "46013",
              "countyName": "Brown"
          },
          {
              "geoID": "46125",
              "countyName": "Turner"
          },
          {
              "geoID": "46005",
              "countyName": "Beadle"
          },
          {
              "geoID": "46103",
              "countyName": "Pennington"
          },
          {
              "geoID": "46039",
              "countyName": "Deuel"
          },
          {
              "geoID": "46087",
              "countyName": "McCook"
          },
          {
              "geoID": "46073",
              "countyName": "Jerauld"
          },
          {
              "geoID": "46099",
              "countyName": "Minnehaha"
          },
          {
              "geoID": "46095",
              "countyName": "Mellette"
          },
          {
              "geoID": "46119",
              "countyName": "Sully"
          },
          {
              "geoID": "46101",
              "countyName": "Moody"
          },
          {
              "geoID": "46045",
              "countyName": "Edmunds"
          },
          {
              "geoID": "46019",
              "countyName": "Butte"
          },
          {
              "geoID": "46111",
              "countyName": "Sanborn"
          },
          {
              "geoID": "46007",
              "countyName": "Bennett"
          },
          {
              "geoID": "46121",
              "countyName": "Todd"
          },
          {
              "geoID": "46067",
              "countyName": "Hutchinson"
          },
          {
              "geoID": "46102",
              "countyName": "Oglala Lakota"
          },
          {
              "geoID": "46079",
              "countyName": "Lake"
          },
          {
              "geoID": "46027",
              "countyName": "Clay"
          },
          {
              "geoID": "46105",
              "countyName": "Perkins"
          },
          {
              "geoID": "46017",
              "countyName": "Buffalo"
          },
          {
              "geoID": "46037",
              "countyName": "Day"
          },
          {
              "geoID": "46029",
              "countyName": "Codington"
          },
          {
              "geoID": "46117",
              "countyName": "Stanley"
          },
          {
              "geoID": "46031",
              "countyName": "Corson"
          },
          {
              "geoID": "46075",
              "countyName": "Jones"
          },
          {
              "geoID": "46041",
              "countyName": "Dewey"
          },
          {
              "geoID": "46011",
              "countyName": "Brookings"
          },
          {
              "geoID": "46071",
              "countyName": "Jackson"
          },
          {
              "geoID": "46021",
              "countyName": "Campbell"
          },
          {
              "geoID": "46063",
              "countyName": "Harding"
          },
          {
              "geoID": "46023",
              "countyName": "Charles Mix"
          },
          {
              "geoID": "46055",
              "countyName": "Haakon"
          },
          {
              "geoID": "46033",
              "countyName": "Custer"
          },
          {
              "geoID": "46035",
              "countyName": "Davison"
          },
          {
              "geoID": "46137",
              "countyName": "Ziebach"
          },
          {
              "geoID": "46091",
              "countyName": "Marshall"
          },
          {
              "geoID": "46009",
              "countyName": "Bon Homme"
          },
          {
              "geoID": "46047",
              "countyName": "Fall River"
          },
          {
              "geoID": "46059",
              "countyName": "Hand"
          },
          {
              "geoID": "46081",
              "countyName": "Lawrence"
          },
          {
              "geoID": "46065",
              "countyName": "Hughes"
          },
          {
              "geoID": "46085",
              "countyName": "Lyman"
          },
          {
              "geoID": "46069",
              "countyName": "Hyde"
          },
          {
              "geoID": "46025",
              "countyName": "Clark"
          },
          {
              "geoID": "46083",
              "countyName": "Lincoln"
          },
          {
              "geoID": "46109",
              "countyName": "Roberts"
          },
          {
              "geoID": "46107",
              "countyName": "Potter"
          },
          {
              "geoID": "46015",
              "countyName": "Brule"
          },
          {
              "geoID": "46043",
              "countyName": "Douglas"
          },
          {
              "geoID": "46115",
              "countyName": "Spink"
          },
          {
              "geoID": "46127",
              "countyName": "Union"
          },
          {
              "geoID": "46123",
              "countyName": "Tripp"
          },
          {
              "geoID": "46077",
              "countyName": "Kingsbury"
          },
          {
              "geoID": "46053",
              "countyName": "Gregory"
          },
          {
              "geoID": "46135",
              "countyName": "Yankton"
          },
          {
              "geoID": "46057",
              "countyName": "Hamlin"
          },
          {
              "geoID": "46049",
              "countyName": "Faulk"
          },
          {
              "geoID": "46089",
              "countyName": "McPherson"
          },
          {
              "geoID": "46093",
              "countyName": "Meade"
          },
          {
              "geoID": "46129",
              "countyName": "Walworth"
          }
      ]
  },
  {
      "id": 47,
      "name": "Tennessee",
      "counties": [
          {
              "geoID": "47091",
              "countyName": "Johnson"
          },
          {
              "geoID": "47139",
              "countyName": "Polk"
          },
          {
              "geoID": "47173",
              "countyName": "Union"
          },
          {
              "geoID": "47043",
              "countyName": "Dickson"
          },
          {
              "geoID": "47049",
              "countyName": "Fentress"
          },
          {
              "geoID": "47007",
              "countyName": "Bledsoe"
          },
          {
              "geoID": "47145",
              "countyName": "Roane"
          },
          {
              "geoID": "47099",
              "countyName": "Lawrence"
          },
          {
              "geoID": "47169",
              "countyName": "Trousdale"
          },
          {
              "geoID": "47065",
              "countyName": "Hamilton"
          },
          {
              "geoID": "47063",
              "countyName": "Hamblen"
          },
          {
              "geoID": "47135",
              "countyName": "Perry"
          },
          {
              "geoID": "47147",
              "countyName": "Robertson"
          },
          {
              "geoID": "47179",
              "countyName": "Washington"
          },
          {
              "geoID": "47107",
              "countyName": "McMinn"
          },
          {
              "geoID": "47035",
              "countyName": "Cumberland"
          },
          {
              "geoID": "47047",
              "countyName": "Fayette"
          },
          {
              "geoID": "47037",
              "countyName": "Davidson"
          },
          {
              "geoID": "47067",
              "countyName": "Hancock"
          },
          {
              "geoID": "47133",
              "countyName": "Overton"
          },
          {
              "geoID": "47121",
              "countyName": "Meigs"
          },
          {
              "geoID": "47105",
              "countyName": "Loudon"
          },
          {
              "geoID": "47087",
              "countyName": "Jackson"
          },
          {
              "geoID": "47017",
              "countyName": "Carroll"
          },
          {
              "geoID": "47119",
              "countyName": "Maury"
          },
          {
              "geoID": "47181",
              "countyName": "Wayne"
          },
          {
              "geoID": "47001",
              "countyName": "Anderson"
          },
          {
              "geoID": "47157",
              "countyName": "Shelby"
          },
          {
              "geoID": "47151",
              "countyName": "Scott"
          },
          {
              "geoID": "47129",
              "countyName": "Morgan"
          },
          {
              "geoID": "47033",
              "countyName": "Crockett"
          },
          {
              "geoID": "47175",
              "countyName": "Van Buren"
          },
          {
              "geoID": "47027",
              "countyName": "Clay"
          },
          {
              "geoID": "47045",
              "countyName": "Dyer"
          },
          {
              "geoID": "47041",
              "countyName": "DeKalb"
          },
          {
              "geoID": "47081",
              "countyName": "Hickman"
          },
          {
              "geoID": "47161",
              "countyName": "Stewart"
          },
          {
              "geoID": "47127",
              "countyName": "Moore"
          },
          {
              "geoID": "47189",
              "countyName": "Wilson"
          },
          {
              "geoID": "47117",
              "countyName": "Marshall"
          },
          {
              "geoID": "47185",
              "countyName": "White"
          },
          {
              "geoID": "47003",
              "countyName": "Bedford"
          },
          {
              "geoID": "47143",
              "countyName": "Rhea"
          },
          {
              "geoID": "47069",
              "countyName": "Hardeman"
          },
          {
              "geoID": "47095",
              "countyName": "Lake"
          },
          {
              "geoID": "47097",
              "countyName": "Lauderdale"
          },
          {
              "geoID": "47023",
              "countyName": "Chester"
          },
          {
              "geoID": "47149",
              "countyName": "Rutherford"
          },
          {
              "geoID": "47153",
              "countyName": "Sequatchie"
          },
          {
              "geoID": "47167",
              "countyName": "Tipton"
          },
          {
              "geoID": "47183",
              "countyName": "Weakley"
          },
          {
              "geoID": "47075",
              "countyName": "Haywood"
          },
          {
              "geoID": "47025",
              "countyName": "Claiborne"
          },
          {
              "geoID": "47103",
              "countyName": "Lincoln"
          },
          {
              "geoID": "47141",
              "countyName": "Putnam"
          },
          {
              "geoID": "47051",
              "countyName": "Franklin"
          },
          {
              "geoID": "47115",
              "countyName": "Marion"
          },
          {
              "geoID": "47165",
              "countyName": "Sumner"
          },
          {
              "geoID": "47011",
              "countyName": "Bradley"
          },
          {
              "geoID": "47123",
              "countyName": "Monroe"
          },
          {
              "geoID": "47055",
              "countyName": "Giles"
          },
          {
              "geoID": "47053",
              "countyName": "Gibson"
          },
          {
              "geoID": "47005",
              "countyName": "Benton"
          },
          {
              "geoID": "47009",
              "countyName": "Blount"
          },
          {
              "geoID": "47079",
              "countyName": "Henry"
          },
          {
              "geoID": "47021",
              "countyName": "Cheatham"
          },
          {
              "geoID": "47029",
              "countyName": "Cocke"
          },
          {
              "geoID": "47039",
              "countyName": "Decatur"
          },
          {
              "geoID": "47071",
              "countyName": "Hardin"
          },
          {
              "geoID": "47163",
              "countyName": "Sullivan"
          },
          {
              "geoID": "47085",
              "countyName": "Humphreys"
          },
          {
              "geoID": "47093",
              "countyName": "Knox"
          },
          {
              "geoID": "47101",
              "countyName": "Lewis"
          },
          {
              "geoID": "47113",
              "countyName": "Madison"
          },
          {
              "geoID": "47125",
              "countyName": "Montgomery"
          },
          {
              "geoID": "47187",
              "countyName": "Williamson"
          },
          {
              "geoID": "47031",
              "countyName": "Coffee"
          },
          {
              "geoID": "47159",
              "countyName": "Smith"
          },
          {
              "geoID": "47137",
              "countyName": "Pickett"
          },
          {
              "geoID": "47109",
              "countyName": "McNairy"
          },
          {
              "geoID": "47171",
              "countyName": "Unicoi"
          },
          {
              "geoID": "47059",
              "countyName": "Greene"
          },
          {
              "geoID": "47083",
              "countyName": "Houston"
          },
          {
              "geoID": "47061",
              "countyName": "Grundy"
          },
          {
              "geoID": "47073",
              "countyName": "Hawkins"
          },
          {
              "geoID": "47057",
              "countyName": "Grainger"
          },
          {
              "geoID": "47019",
              "countyName": "Carter"
          },
          {
              "geoID": "47089",
              "countyName": "Jefferson"
          },
          {
              "geoID": "47013",
              "countyName": "Campbell"
          },
          {
              "geoID": "47015",
              "countyName": "Cannon"
          },
          {
              "geoID": "47177",
              "countyName": "Warren"
          },
          {
              "geoID": "47131",
              "countyName": "Obion"
          },
          {
              "geoID": "47077",
              "countyName": "Henderson"
          },
          {
              "geoID": "47155",
              "countyName": "Sevier"
          },
          {
              "geoID": "47111",
              "countyName": "Macon"
          }
      ]
  },
  {
      "id": 48,
      "name": "Texas",
      "counties": [
          {
              "geoID": "48421",
              "countyName": "Sherman"
          },
          {
              "geoID": "48493",
              "countyName": "Wilson"
          },
          {
              "geoID": "48115",
              "countyName": "Dawson"
          },
          {
              "geoID": "48069",
              "countyName": "Castro"
          },
          {
              "geoID": "48279",
              "countyName": "Lamb"
          },
          {
              "geoID": "48385",
              "countyName": "Real"
          },
          {
              "geoID": "48359",
              "countyName": "Oldham"
          },
          {
              "geoID": "48127",
              "countyName": "Dimmit"
          },
          {
              "geoID": "48305",
              "countyName": "Lynn"
          },
          {
              "geoID": "48171",
              "countyName": "Gillespie"
          },
          {
              "geoID": "48461",
              "countyName": "Upton"
          },
          {
              "geoID": "48145",
              "countyName": "Falls"
          },
          {
              "geoID": "48307",
              "countyName": "McCulloch"
          },
          {
              "geoID": "48247",
              "countyName": "Jim Hogg"
          },
          {
              "geoID": "48353",
              "countyName": "Nolan"
          },
          {
              "geoID": "48147",
              "countyName": "Fannin"
          },
          {
              "geoID": "48459",
              "countyName": "Upshur"
          },
          {
              "geoID": "48413",
              "countyName": "Schleicher"
          },
          {
              "geoID": "48151",
              "countyName": "Fisher"
          },
          {
              "geoID": "48257",
              "countyName": "Kaufman"
          },
          {
              "geoID": "48221",
              "countyName": "Hood"
          },
          {
              "geoID": "48085",
              "countyName": "Collin"
          },
          {
              "geoID": "48075",
              "countyName": "Childress"
          },
          {
              "geoID": "48143",
              "countyName": "Erath"
          },
          {
              "geoID": "48123",
              "countyName": "DeWitt"
          },
          {
              "geoID": "48193",
              "countyName": "Hamilton"
          },
          {
              "geoID": "48129",
              "countyName": "Donley"
          },
          {
              "geoID": "48019",
              "countyName": "Bandera"
          },
          {
              "geoID": "48055",
              "countyName": "Caldwell"
          },
          {
              "geoID": "48111",
              "countyName": "Dallam"
          },
          {
              "geoID": "48283",
              "countyName": "La Salle"
          },
          {
              "geoID": "48311",
              "countyName": "McMullen"
          },
          {
              "geoID": "48381",
              "countyName": "Randall"
          },
          {
              "geoID": "48399",
              "countyName": "Runnels"
          },
          {
              "geoID": "48445",
              "countyName": "Terry"
          },
          {
              "geoID": "48463",
              "countyName": "Uvalde"
          },
          {
              "geoID": "48483",
              "countyName": "Wheeler"
          },
          {
              "geoID": "48303",
              "countyName": "Lubbock"
          },
          {
              "geoID": "48285",
              "countyName": "Lavaca"
          },
          {
              "geoID": "48321",
              "countyName": "Matagorda"
          },
          {
              "geoID": "48397",
              "countyName": "Rockwall"
          },
          {
              "geoID": "48429",
              "countyName": "Stephens"
          },
          {
              "geoID": "48363",
              "countyName": "Palo Pinto"
          },
          {
              "geoID": "48029",
              "countyName": "Bexar"
          },
          {
              "geoID": "48281",
              "countyName": "Lampasas"
          },
          {
              "geoID": "48113",
              "countyName": "Dallas"
          },
          {
              "geoID": "48051",
              "countyName": "Burleson"
          },
          {
              "geoID": "48383",
              "countyName": "Reagan"
          },
          {
              "geoID": "48411",
              "countyName": "San Saba"
          },
          {
              "geoID": "48475",
              "countyName": "Ward"
          },
          {
              "geoID": "48253",
              "countyName": "Jones"
          },
          {
              "geoID": "48319",
              "countyName": "Mason"
          },
          {
              "geoID": "48335",
              "countyName": "Mitchell"
          },
          {
              "geoID": "48433",
              "countyName": "Stonewall"
          },
          {
              "geoID": "48313",
              "countyName": "Madison"
          },
          {
              "geoID": "48477",
              "countyName": "Washington"
          },
          {
              "geoID": "48291",
              "countyName": "Liberty"
          },
          {
              "geoID": "48235",
              "countyName": "Irion"
          },
          {
              "geoID": "48195",
              "countyName": "Hansford"
          },
          {
              "geoID": "48255",
              "countyName": "Karnes"
          },
          {
              "geoID": "48301",
              "countyName": "Loving"
          },
          {
              "geoID": "48131",
              "countyName": "Duval"
          },
          {
              "geoID": "48045",
              "countyName": "Briscoe"
          },
          {
              "geoID": "48047",
              "countyName": "Brooks"
          },
          {
              "geoID": "48139",
              "countyName": "Ellis"
          },
          {
              "geoID": "48219",
              "countyName": "Hockley"
          },
          {
              "geoID": "48007",
              "countyName": "Aransas"
          },
          {
              "geoID": "48159",
              "countyName": "Franklin"
          },
          {
              "geoID": "48165",
              "countyName": "Gaines"
          },
          {
              "geoID": "48211",
              "countyName": "Hemphill"
          },
          {
              "geoID": "48205",
              "countyName": "Hartley"
          },
          {
              "geoID": "48087",
              "countyName": "Collingsworth"
          },
          {
              "geoID": "48153",
              "countyName": "Floyd"
          },
          {
              "geoID": "48011",
              "countyName": "Armstrong"
          },
          {
              "geoID": "48495",
              "countyName": "Winkler"
          },
          {
              "geoID": "48263",
              "countyName": "Kent"
          },
          {
              "geoID": "48379",
              "countyName": "Rains"
          },
          {
              "geoID": "48093",
              "countyName": "Comanche"
          },
          {
              "geoID": "48437",
              "countyName": "Swisher"
          },
          {
              "geoID": "48017",
              "countyName": "Bailey"
          },
          {
              "geoID": "48375",
              "countyName": "Potter"
          },
          {
              "geoID": "48497",
              "countyName": "Wise"
          },
          {
              "geoID": "48025",
              "countyName": "Bee"
          },
          {
              "geoID": "48053",
              "countyName": "Burnet"
          },
          {
              "geoID": "48163",
              "countyName": "Frio"
          },
          {
              "geoID": "48237",
              "countyName": "Jack"
          },
          {
              "geoID": "48173",
              "countyName": "Glasscock"
          },
          {
              "geoID": "48203",
              "countyName": "Harrison"
          },
          {
              "geoID": "48177",
              "countyName": "Gonzales"
          },
          {
              "geoID": "48133",
              "countyName": "Eastland"
          },
          {
              "geoID": "48137",
              "countyName": "Edwards"
          },
          {
              "geoID": "48015",
              "countyName": "Austin"
          },
          {
              "geoID": "48103",
              "countyName": "Crane"
          },
          {
              "geoID": "48059",
              "countyName": "Callahan"
          },
          {
              "geoID": "48071",
              "countyName": "Chambers"
          },
          {
              "geoID": "48431",
              "countyName": "Sterling"
          },
          {
              "geoID": "48077",
              "countyName": "Clay"
          },
          {
              "geoID": "48057",
              "countyName": "Calhoun"
          },
          {
              "geoID": "48003",
              "countyName": "Andrews"
          },
          {
              "geoID": "48287",
              "countyName": "Lee"
          },
          {
              "geoID": "48041",
              "countyName": "Brazos"
          },
          {
              "geoID": "48277",
              "countyName": "Lamar"
          },
          {
              "geoID": "48095",
              "countyName": "Concho"
          },
          {
              "geoID": "48355",
              "countyName": "Nueces"
          },
          {
              "geoID": "48347",
              "countyName": "Nacogdoches"
          },
          {
              "geoID": "48097",
              "countyName": "Cooke"
          },
          {
              "geoID": "48207",
              "countyName": "Haskell"
          },
          {
              "geoID": "48407",
              "countyName": "San Jacinto"
          },
          {
              "geoID": "48507",
              "countyName": "Zavala"
          },
          {
              "geoID": "48339",
              "countyName": "Montgomery"
          },
          {
              "geoID": "48175",
              "countyName": "Goliad"
          },
          {
              "geoID": "48067",
              "countyName": "Cass"
          },
          {
              "geoID": "48427",
              "countyName": "Starr"
          },
          {
              "geoID": "48223",
              "countyName": "Hopkins"
          },
          {
              "geoID": "48485",
              "countyName": "Wichita"
          },
          {
              "geoID": "48357",
              "countyName": "Ochiltree"
          },
          {
              "geoID": "48023",
              "countyName": "Baylor"
          },
          {
              "geoID": "48401",
              "countyName": "Rusk"
          },
          {
              "geoID": "48065",
              "countyName": "Carson"
          },
          {
              "geoID": "48027",
              "countyName": "Bell"
          },
          {
              "geoID": "48201",
              "countyName": "Harris"
          },
          {
              "geoID": "48217",
              "countyName": "Hill"
          },
          {
              "geoID": "48229",
              "countyName": "Hudspeth"
          },
          {
              "geoID": "48167",
              "countyName": "Galveston"
          },
          {
              "geoID": "48073",
              "countyName": "Cherokee"
          },
          {
              "geoID": "48079",
              "countyName": "Cochran"
          },
          {
              "geoID": "48081",
              "countyName": "Coke"
          },
          {
              "geoID": "48089",
              "countyName": "Colorado"
          },
          {
              "geoID": "48091",
              "countyName": "Comal"
          },
          {
              "geoID": "48099",
              "countyName": "Coryell"
          },
          {
              "geoID": "48105",
              "countyName": "Crockett"
          },
          {
              "geoID": "48119",
              "countyName": "Delta"
          },
          {
              "geoID": "48425",
              "countyName": "Somervell"
          },
          {
              "geoID": "48215",
              "countyName": "Hidalgo"
          },
          {
              "geoID": "48265",
              "countyName": "Kerr"
          },
          {
              "geoID": "48233",
              "countyName": "Hutchinson"
          },
          {
              "geoID": "48157",
              "countyName": "Fort Bend"
          },
          {
              "geoID": "48345",
              "countyName": "Motley"
          },
          {
              "geoID": "48299",
              "countyName": "Llano"
          },
          {
              "geoID": "48033",
              "countyName": "Borden"
          },
          {
              "geoID": "48455",
              "countyName": "Trinity"
          },
          {
              "geoID": "48389",
              "countyName": "Reeves"
          },
          {
              "geoID": "48039",
              "countyName": "Brazoria"
          },
          {
              "geoID": "48061",
              "countyName": "Cameron"
          },
          {
              "geoID": "48417",
              "countyName": "Shackelford"
          },
          {
              "geoID": "48261",
              "countyName": "Kenedy"
          },
          {
              "geoID": "48405",
              "countyName": "San Augustine"
          },
          {
              "geoID": "48005",
              "countyName": "Angelina"
          },
          {
              "geoID": "48183",
              "countyName": "Gregg"
          },
          {
              "geoID": "48467",
              "countyName": "Van Zandt"
          },
          {
              "geoID": "48337",
              "countyName": "Montague"
          },
          {
              "geoID": "48135",
              "countyName": "Ector"
          },
          {
              "geoID": "48187",
              "countyName": "Guadalupe"
          },
          {
              "geoID": "48209",
              "countyName": "Hays"
          },
          {
              "geoID": "48293",
              "countyName": "Limestone"
          },
          {
              "geoID": "48185",
              "countyName": "Grimes"
          },
          {
              "geoID": "48179",
              "countyName": "Gray"
          },
          {
              "geoID": "48199",
              "countyName": "Hardin"
          },
          {
              "geoID": "48323",
              "countyName": "Maverick"
          },
          {
              "geoID": "48225",
              "countyName": "Houston"
          },
          {
              "geoID": "48395",
              "countyName": "Robertson"
          },
          {
              "geoID": "48181",
              "countyName": "Grayson"
          },
          {
              "geoID": "48149",
              "countyName": "Fayette"
          },
          {
              "geoID": "48271",
              "countyName": "Kinney"
          },
          {
              "geoID": "48289",
              "countyName": "Leon"
          },
          {
              "geoID": "48361",
              "countyName": "Orange"
          },
          {
              "geoID": "48367",
              "countyName": "Parker"
          },
          {
              "geoID": "48377",
              "countyName": "Presidio"
          },
          {
              "geoID": "48449",
              "countyName": "Titus"
          },
          {
              "geoID": "48391",
              "countyName": "Refugio"
          },
          {
              "geoID": "48241",
              "countyName": "Jasper"
          },
          {
              "geoID": "48245",
              "countyName": "Jefferson"
          },
          {
              "geoID": "48387",
              "countyName": "Red River"
          },
          {
              "geoID": "48393",
              "countyName": "Roberts"
          },
          {
              "geoID": "48083",
              "countyName": "Coleman"
          },
          {
              "geoID": "48403",
              "countyName": "Sabine"
          },
          {
              "geoID": "48443",
              "countyName": "Terrell"
          },
          {
              "geoID": "48471",
              "countyName": "Walker"
          },
          {
              "geoID": "48251",
              "countyName": "Johnson"
          },
          {
              "geoID": "48035",
              "countyName": "Bosque"
          },
          {
              "geoID": "48451",
              "countyName": "Tom Green"
          },
          {
              "geoID": "48349",
              "countyName": "Navarro"
          },
          {
              "geoID": "48043",
              "countyName": "Brewster"
          },
          {
              "geoID": "48501",
              "countyName": "Yoakum"
          },
          {
              "geoID": "48505",
              "countyName": "Zapata"
          },
          {
              "geoID": "48239",
              "countyName": "Jackson"
          },
          {
              "geoID": "48273",
              "countyName": "Kleberg"
          },
          {
              "geoID": "48369",
              "countyName": "Parmer"
          },
          {
              "geoID": "48275",
              "countyName": "Knox"
          },
          {
              "geoID": "48439",
              "countyName": "Tarrant"
          },
          {
              "geoID": "48021",
              "countyName": "Bastrop"
          },
          {
              "geoID": "48269",
              "countyName": "King"
          },
          {
              "geoID": "48031",
              "countyName": "Blanco"
          },
          {
              "geoID": "48343",
              "countyName": "Morris"
          },
          {
              "geoID": "48419",
              "countyName": "Shelby"
          },
          {
              "geoID": "48489",
              "countyName": "Willacy"
          },
          {
              "geoID": "48325",
              "countyName": "Medina"
          },
          {
              "geoID": "48213",
              "countyName": "Henderson"
          },
          {
              "geoID": "48161",
              "countyName": "Freestone"
          },
          {
              "geoID": "48249",
              "countyName": "Jim Wells"
          },
          {
              "geoID": "48297",
              "countyName": "Live Oak"
          },
          {
              "geoID": "48409",
              "countyName": "San Patricio"
          },
          {
              "geoID": "48295",
              "countyName": "Lipscomb"
          },
          {
              "geoID": "48487",
              "countyName": "Wilbarger"
          },
          {
              "geoID": "48141",
              "countyName": "El Paso"
          },
          {
              "geoID": "48309",
              "countyName": "McLennan"
          },
          {
              "geoID": "48259",
              "countyName": "Kendall"
          },
          {
              "geoID": "48155",
              "countyName": "Foard"
          },
          {
              "geoID": "48327",
              "countyName": "Menard"
          },
          {
              "geoID": "48473",
              "countyName": "Waller"
          },
          {
              "geoID": "48009",
              "countyName": "Archer"
          },
          {
              "geoID": "48503",
              "countyName": "Young"
          },
          {
              "geoID": "48441",
              "countyName": "Taylor"
          },
          {
              "geoID": "48049",
              "countyName": "Brown"
          },
          {
              "geoID": "48457",
              "countyName": "Tyler"
          },
          {
              "geoID": "48189",
              "countyName": "Hale"
          },
          {
              "geoID": "48447",
              "countyName": "Throckmorton"
          },
          {
              "geoID": "48101",
              "countyName": "Cottle"
          },
          {
              "geoID": "48125",
              "countyName": "Dickens"
          },
          {
              "geoID": "48479",
              "countyName": "Webb"
          },
          {
              "geoID": "48481",
              "countyName": "Wharton"
          },
          {
              "geoID": "48329",
              "countyName": "Midland"
          },
          {
              "geoID": "48435",
              "countyName": "Sutton"
          },
          {
              "geoID": "48013",
              "countyName": "Atascosa"
          },
          {
              "geoID": "48341",
              "countyName": "Moore"
          },
          {
              "geoID": "48107",
              "countyName": "Crosby"
          },
          {
              "geoID": "48331",
              "countyName": "Milam"
          },
          {
              "geoID": "48373",
              "countyName": "Polk"
          },
          {
              "geoID": "48423",
              "countyName": "Smith"
          },
          {
              "geoID": "48231",
              "countyName": "Hunt"
          },
          {
              "geoID": "48121",
              "countyName": "Denton"
          },
          {
              "geoID": "48267",
              "countyName": "Kimble"
          },
          {
              "geoID": "48371",
              "countyName": "Pecos"
          },
          {
              "geoID": "48491",
              "countyName": "Williamson"
          },
          {
              "geoID": "48191",
              "countyName": "Hall"
          },
          {
              "geoID": "48169",
              "countyName": "Garza"
          },
          {
              "geoID": "48465",
              "countyName": "Val Verde"
          },
          {
              "geoID": "48243",
              "countyName": "Jeff Davis"
          },
          {
              "geoID": "48315",
              "countyName": "Marion"
          },
          {
              "geoID": "48333",
              "countyName": "Mills"
          },
          {
              "geoID": "48197",
              "countyName": "Hardeman"
          },
          {
              "geoID": "48317",
              "countyName": "Martin"
          },
          {
              "geoID": "48415",
              "countyName": "Scurry"
          },
          {
              "geoID": "48117",
              "countyName": "Deaf Smith"
          },
          {
              "geoID": "48001",
              "countyName": "Anderson"
          },
          {
              "geoID": "48037",
              "countyName": "Bowie"
          },
          {
              "geoID": "48453",
              "countyName": "Travis"
          },
          {
              "geoID": "48365",
              "countyName": "Panola"
          },
          {
              "geoID": "48499",
              "countyName": "Wood"
          },
          {
              "geoID": "48063",
              "countyName": "Camp"
          },
          {
              "geoID": "48227",
              "countyName": "Howard"
          },
          {
              "geoID": "48109",
              "countyName": "Culberson"
          },
          {
              "geoID": "48469",
              "countyName": "Victoria"
          },
          {
              "geoID": "48351",
              "countyName": "Newton"
          }
      ]
  },
  {
      "id": 49,
      "name": "Utah",
      "counties": [
          {
              "geoID": "49013",
              "countyName": "Duchesne"
          },
          {
              "geoID": "49005",
              "countyName": "Cache"
          },
          {
              "geoID": "49041",
              "countyName": "Sevier"
          },
          {
              "geoID": "49027",
              "countyName": "Millard"
          },
          {
              "geoID": "49035",
              "countyName": "Salt Lake"
          },
          {
              "geoID": "49009",
              "countyName": "Daggett"
          },
          {
              "geoID": "49055",
              "countyName": "Wayne"
          },
          {
              "geoID": "49057",
              "countyName": "Weber"
          },
          {
              "geoID": "49023",
              "countyName": "Juab"
          },
          {
              "geoID": "49017",
              "countyName": "Garfield"
          },
          {
              "geoID": "49049",
              "countyName": "Utah"
          },
          {
              "geoID": "49037",
              "countyName": "San Juan"
          },
          {
              "geoID": "49003",
              "countyName": "Box Elder"
          },
          {
              "geoID": "49015",
              "countyName": "Emery"
          },
          {
              "geoID": "49045",
              "countyName": "Tooele"
          },
          {
              "geoID": "49029",
              "countyName": "Morgan"
          },
          {
              "geoID": "49047",
              "countyName": "Uintah"
          },
          {
              "geoID": "49025",
              "countyName": "Kane"
          },
          {
              "geoID": "49043",
              "countyName": "Summit"
          },
          {
              "geoID": "49033",
              "countyName": "Rich"
          },
          {
              "geoID": "49051",
              "countyName": "Wasatch"
          },
          {
              "geoID": "49007",
              "countyName": "Carbon"
          },
          {
              "geoID": "49019",
              "countyName": "Grand"
          },
          {
              "geoID": "49053",
              "countyName": "Washington"
          },
          {
              "geoID": "49011",
              "countyName": "Davis"
          },
          {
              "geoID": "49001",
              "countyName": "Beaver"
          },
          {
              "geoID": "49039",
              "countyName": "Sanpete"
          },
          {
              "geoID": "49031",
              "countyName": "Piute"
          },
          {
              "geoID": "49021",
              "countyName": "Iron"
          }
      ]
  },
  {
      "id": 50,
      "name": "Vermont",
      "counties": [
          {
              "geoID": "50011",
              "countyName": "Franklin"
          },
          {
              "geoID": "50015",
              "countyName": "Lamoille"
          },
          {
              "geoID": "50013",
              "countyName": "Grand Isle"
          },
          {
              "geoID": "50021",
              "countyName": "Rutland"
          },
          {
              "geoID": "50001",
              "countyName": "Addison"
          },
          {
              "geoID": "50027",
              "countyName": "Windsor"
          },
          {
              "geoID": "50017",
              "countyName": "Orange"
          },
          {
              "geoID": "50025",
              "countyName": "Windham"
          },
          {
              "geoID": "50007",
              "countyName": "Chittenden"
          },
          {
              "geoID": "50005",
              "countyName": "Caledonia"
          },
          {
              "geoID": "50019",
              "countyName": "Orleans"
          },
          {
              "geoID": "50023",
              "countyName": "Washington"
          },
          {
              "geoID": "50003",
              "countyName": "Bennington"
          },
          {
              "geoID": "50009",
              "countyName": "Essex"
          }
      ]
  },
  {
      "id": 51,
      "name": "Virginia",
      "counties": [
          {
              "geoID": "51680",
              "countyName": "Lynchburg"
          },
          {
              "geoID": "51775",
              "countyName": "Salem"
          },
          {
              "geoID": "51670",
              "countyName": "Hopewell"
          },
          {
              "geoID": "51009",
              "countyName": "Amherst"
          },
          {
              "geoID": "51097",
              "countyName": "King and Queen"
          },
          {
              "geoID": "51099",
              "countyName": "King George"
          },
          {
              "geoID": "51093",
              "countyName": "Isle of Wight"
          },
          {
              "geoID": "51139",
              "countyName": "Page"
          },
          {
              "geoID": "51036",
              "countyName": "Charles City"
          },
          {
              "geoID": "51181",
              "countyName": "Surry"
          },
          {
              "geoID": "51520",
              "countyName": "Bristol"
          },
          {
              "geoID": "51003",
              "countyName": "Albemarle"
          },
          {
              "geoID": "51037",
              "countyName": "Charlotte"
          },
          {
              "geoID": "51013",
              "countyName": "Arlington"
          },
          {
              "geoID": "51065",
              "countyName": "Fluvanna"
          },
          {
              "geoID": "51043",
              "countyName": "Clarke"
          },
          {
              "geoID": "51103",
              "countyName": "Lancaster"
          },
          {
              "geoID": "51167",
              "countyName": "Russell"
          },
          {
              "geoID": "51630",
              "countyName": "Fredericksburg"
          },
          {
              "geoID": "51660",
              "countyName": "Harrisonburg"
          },
          {
              "geoID": "51840",
              "countyName": "Winchester"
          },
          {
              "geoID": "51580",
              "countyName": "Covington"
          },
          {
              "geoID": "51550",
              "countyName": "Chesapeake"
          },
          {
              "geoID": "51770",
              "countyName": "Roanoke"
          },
          {
              "geoID": "51131",
              "countyName": "Northampton"
          },
          {
              "geoID": "51720",
              "countyName": "Norton"
          },
          {
              "geoID": "51830",
              "countyName": "Williamsburg"
          },
          {
              "geoID": "51800",
              "countyName": "Suffolk"
          },
          {
              "geoID": "51073",
              "countyName": "Gloucester"
          },
          {
              "geoID": "51127",
              "countyName": "New Kent"
          },
          {
              "geoID": "51600",
              "countyName": "Fairfax"
          },
          {
              "geoID": "51690",
              "countyName": "Martinsville"
          },
          {
              "geoID": "51678",
              "countyName": "Lexington"
          },
          {
              "geoID": "51185",
              "countyName": "Tazewell"
          },
          {
              "geoID": "51031",
              "countyName": "Campbell"
          },
          {
              "geoID": "51683",
              "countyName": "Manassas"
          },
          {
              "geoID": "51530",
              "countyName": "Buena Vista"
          },
          {
              "geoID": "51540",
              "countyName": "Charlottesville"
          },
          {
              "geoID": "51033",
              "countyName": "Caroline"
          },
          {
              "geoID": "51640",
              "countyName": "Galax"
          },
          {
              "geoID": "51145",
              "countyName": "Powhatan"
          },
          {
              "geoID": "51183",
              "countyName": "Sussex"
          },
          {
              "geoID": "51047",
              "countyName": "Culpeper"
          },
          {
              "geoID": "51610",
              "countyName": "Falls Church"
          },
          {
              "geoID": "51173",
              "countyName": "Smyth"
          },
          {
              "geoID": "51029",
              "countyName": "Buckingham"
          },
          {
              "geoID": "51075",
              "countyName": "Goochland"
          },
          {
              "geoID": "51620",
              "countyName": "Franklin"
          },
          {
              "geoID": "51121",
              "countyName": "Montgomery"
          },
          {
              "geoID": "51750",
              "countyName": "Radford"
          },
          {
              "geoID": "51760",
              "countyName": "Richmond"
          },
          {
              "geoID": "51135",
              "countyName": "Nottoway"
          },
          {
              "geoID": "51023",
              "countyName": "Botetourt"
          },
          {
              "geoID": "51141",
              "countyName": "Patrick"
          },
          {
              "geoID": "51035",
              "countyName": "Carroll"
          },
          {
              "geoID": "51119",
              "countyName": "Middlesex"
          },
          {
              "geoID": "51810",
              "countyName": "Virginia Beach"
          },
          {
              "geoID": "51061",
              "countyName": "Fauquier"
          },
          {
              "geoID": "51071",
              "countyName": "Giles"
          },
          {
              "geoID": "51021",
              "countyName": "Bland"
          },
          {
              "geoID": "51510",
              "countyName": "Alexandria"
          },
          {
              "geoID": "51735",
              "countyName": "Poquoson"
          },
          {
              "geoID": "51685",
              "countyName": "Manassas Park"
          },
          {
              "geoID": "51730",
              "countyName": "Petersburg"
          },
          {
              "geoID": "51179",
              "countyName": "Stafford"
          },
          {
              "geoID": "51710",
              "countyName": "Norfolk"
          },
          {
              "geoID": "51111",
              "countyName": "Lunenburg"
          },
          {
              "geoID": "51700",
              "countyName": "Newport News"
          },
          {
              "geoID": "51175",
              "countyName": "Southampton"
          },
          {
              "geoID": "51053",
              "countyName": "Dinwiddie"
          },
          {
              "geoID": "51067",
              "countyName": "Franklin"
          },
          {
              "geoID": "51147",
              "countyName": "Prince Edward"
          },
          {
              "geoID": "51149",
              "countyName": "Prince George"
          },
          {
              "geoID": "51153",
              "countyName": "Prince William"
          },
          {
              "geoID": "51163",
              "countyName": "Rockbridge"
          },
          {
              "geoID": "51191",
              "countyName": "Washington"
          },
          {
              "geoID": "51113",
              "countyName": "Madison"
          },
          {
              "geoID": "51137",
              "countyName": "Orange"
          },
          {
              "geoID": "51157",
              "countyName": "Rappahannock"
          },
          {
              "geoID": "51193",
              "countyName": "Westmoreland"
          },
          {
              "geoID": "51101",
              "countyName": "King William"
          },
          {
              "geoID": "51079",
              "countyName": "Greene"
          },
          {
              "geoID": "51570",
              "countyName": "Colonial Heights"
          },
          {
              "geoID": "51590",
              "countyName": "Danville"
          },
          {
              "geoID": "51820",
              "countyName": "Waynesboro"
          },
          {
              "geoID": "51069",
              "countyName": "Frederick"
          },
          {
              "geoID": "51165",
              "countyName": "Rockingham"
          },
          {
              "geoID": "51171",
              "countyName": "Shenandoah"
          },
          {
              "geoID": "51063",
              "countyName": "Floyd"
          },
          {
              "geoID": "51015",
              "countyName": "Augusta"
          },
          {
              "geoID": "51005",
              "countyName": "Alleghany"
          },
          {
              "geoID": "51017",
              "countyName": "Bath"
          },
          {
              "geoID": "51007",
              "countyName": "Amelia"
          },
          {
              "geoID": "51001",
              "countyName": "Accomack"
          },
          {
              "geoID": "51051",
              "countyName": "Dickenson"
          },
          {
              "geoID": "51081",
              "countyName": "Greensville"
          },
          {
              "geoID": "51083",
              "countyName": "Halifax"
          },
          {
              "geoID": "51095",
              "countyName": "James City"
          },
          {
              "geoID": "51087",
              "countyName": "Henrico"
          },
          {
              "geoID": "51059",
              "countyName": "Fairfax"
          },
          {
              "geoID": "51109",
              "countyName": "Louisa"
          },
          {
              "geoID": "51155",
              "countyName": "Pulaski"
          },
          {
              "geoID": "51197",
              "countyName": "Wythe"
          },
          {
              "geoID": "51049",
              "countyName": "Cumberland"
          },
          {
              "geoID": "51740",
              "countyName": "Portsmouth"
          },
          {
              "geoID": "51019",
              "countyName": "Bedford"
          },
          {
              "geoID": "51027",
              "countyName": "Buchanan"
          },
          {
              "geoID": "51177",
              "countyName": "Spotsylvania"
          },
          {
              "geoID": "51790",
              "countyName": "Staunton"
          },
          {
              "geoID": "51105",
              "countyName": "Lee"
          },
          {
              "geoID": "51195",
              "countyName": "Wise"
          },
          {
              "geoID": "51091",
              "countyName": "Highland"
          },
          {
              "geoID": "51169",
              "countyName": "Scott"
          },
          {
              "geoID": "51133",
              "countyName": "Northumberland"
          },
          {
              "geoID": "51125",
              "countyName": "Nelson"
          },
          {
              "geoID": "51650",
              "countyName": "Hampton"
          },
          {
              "geoID": "51595",
              "countyName": "Emporia"
          },
          {
              "geoID": "51041",
              "countyName": "Chesterfield"
          },
          {
              "geoID": "51159",
              "countyName": "Richmond"
          },
          {
              "geoID": "51161",
              "countyName": "Roanoke"
          },
          {
              "geoID": "51057",
              "countyName": "Essex"
          },
          {
              "geoID": "51011",
              "countyName": "Appomattox"
          },
          {
              "geoID": "51187",
              "countyName": "Warren"
          },
          {
              "geoID": "51199",
              "countyName": "York"
          },
          {
              "geoID": "51089",
              "countyName": "Henry"
          },
          {
              "geoID": "51025",
              "countyName": "Brunswick"
          },
          {
              "geoID": "51117",
              "countyName": "Mecklenburg"
          },
          {
              "geoID": "51143",
              "countyName": "Pittsylvania"
          },
          {
              "geoID": "51045",
              "countyName": "Craig"
          },
          {
              "geoID": "51085",
              "countyName": "Hanover"
          },
          {
              "geoID": "51107",
              "countyName": "Loudoun"
          },
          {
              "geoID": "51077",
              "countyName": "Grayson"
          },
          {
              "geoID": "51115",
              "countyName": "Mathews"
          }
      ]
  },
  {
      "id": 53,
      "name": "Washington",
      "counties": [
          {
              "geoID": "53031",
              "countyName": "Jefferson"
          },
          {
              "geoID": "53023",
              "countyName": "Garfield"
          },
          {
              "geoID": "53061",
              "countyName": "Snohomish"
          },
          {
              "geoID": "53003",
              "countyName": "Asotin"
          },
          {
              "geoID": "53053",
              "countyName": "Pierce"
          },
          {
              "geoID": "53027",
              "countyName": "Grays Harbor"
          },
          {
              "geoID": "53029",
              "countyName": "Island"
          },
          {
              "geoID": "53045",
              "countyName": "Mason"
          },
          {
              "geoID": "53011",
              "countyName": "Clark"
          },
          {
              "geoID": "53069",
              "countyName": "Wahkiakum"
          },
          {
              "geoID": "53075",
              "countyName": "Whitman"
          },
          {
              "geoID": "53063",
              "countyName": "Spokane"
          },
          {
              "geoID": "53059",
              "countyName": "Skamania"
          },
          {
              "geoID": "53049",
              "countyName": "Pacific"
          },
          {
              "geoID": "53037",
              "countyName": "Kittitas"
          },
          {
              "geoID": "53009",
              "countyName": "Clallam"
          },
          {
              "geoID": "53019",
              "countyName": "Ferry"
          },
          {
              "geoID": "53051",
              "countyName": "Pend Oreille"
          },
          {
              "geoID": "53055",
              "countyName": "San Juan"
          },
          {
              "geoID": "53065",
              "countyName": "Stevens"
          },
          {
              "geoID": "53073",
              "countyName": "Whatcom"
          },
          {
              "geoID": "53017",
              "countyName": "Douglas"
          },
          {
              "geoID": "53033",
              "countyName": "King"
          },
          {
              "geoID": "53015",
              "countyName": "Cowlitz"
          },
          {
              "geoID": "53041",
              "countyName": "Lewis"
          },
          {
              "geoID": "53005",
              "countyName": "Benton"
          },
          {
              "geoID": "53077",
              "countyName": "Yakima"
          },
          {
              "geoID": "53013",
              "countyName": "Columbia"
          },
          {
              "geoID": "53025",
              "countyName": "Grant"
          },
          {
              "geoID": "53067",
              "countyName": "Thurston"
          },
          {
              "geoID": "53001",
              "countyName": "Adams"
          },
          {
              "geoID": "53039",
              "countyName": "Klickitat"
          },
          {
              "geoID": "53007",
              "countyName": "Chelan"
          },
          {
              "geoID": "53043",
              "countyName": "Lincoln"
          },
          {
              "geoID": "53047",
              "countyName": "Okanogan"
          },
          {
              "geoID": "53071",
              "countyName": "Walla Walla"
          },
          {
              "geoID": "53021",
              "countyName": "Franklin"
          },
          {
              "geoID": "53035",
              "countyName": "Kitsap"
          },
          {
              "geoID": "53057",
              "countyName": "Skagit"
          }
      ]
  },
  {
      "id": 54,
      "name": "West Virginia",
      "counties": [
          {
              "geoID": "54073",
              "countyName": "Pleasants"
          },
          {
              "geoID": "54093",
              "countyName": "Tucker"
          },
          {
              "geoID": "54109",
              "countyName": "Wyoming"
          },
          {
              "geoID": "54009",
              "countyName": "Brooke"
          },
          {
              "geoID": "54059",
              "countyName": "Mingo"
          },
          {
              "geoID": "54065",
              "countyName": "Morgan"
          },
          {
              "geoID": "54091",
              "countyName": "Taylor"
          },
          {
              "geoID": "54005",
              "countyName": "Boone"
          },
          {
              "geoID": "54051",
              "countyName": "Marshall"
          },
          {
              "geoID": "54095",
              "countyName": "Tyler"
          },
          {
              "geoID": "54015",
              "countyName": "Clay"
          },
          {
              "geoID": "54087",
              "countyName": "Roane"
          },
          {
              "geoID": "54031",
              "countyName": "Hardy"
          },
          {
              "geoID": "54083",
              "countyName": "Randolph"
          },
          {
              "geoID": "54097",
              "countyName": "Upshur"
          },
          {
              "geoID": "54003",
              "countyName": "Berkeley"
          },
          {
              "geoID": "54013",
              "countyName": "Calhoun"
          },
          {
              "geoID": "54089",
              "countyName": "Summers"
          },
          {
              "geoID": "54047",
              "countyName": "McDowell"
          },
          {
              "geoID": "54029",
              "countyName": "Hancock"
          },
          {
              "geoID": "54053",
              "countyName": "Mason"
          },
          {
              "geoID": "54069",
              "countyName": "Ohio"
          },
          {
              "geoID": "54011",
              "countyName": "Cabell"
          },
          {
              "geoID": "54099",
              "countyName": "Wayne"
          },
          {
              "geoID": "54037",
              "countyName": "Jefferson"
          },
          {
              "geoID": "54057",
              "countyName": "Mineral"
          },
          {
              "geoID": "54061",
              "countyName": "Monongalia"
          },
          {
              "geoID": "54085",
              "countyName": "Ritchie"
          },
          {
              "geoID": "54049",
              "countyName": "Marion"
          },
          {
              "geoID": "54107",
              "countyName": "Wood"
          },
          {
              "geoID": "54105",
              "countyName": "Wirt"
          },
          {
              "geoID": "54039",
              "countyName": "Kanawha"
          },
          {
              "geoID": "54081",
              "countyName": "Raleigh"
          },
          {
              "geoID": "54025",
              "countyName": "Greenbrier"
          },
          {
              "geoID": "54075",
              "countyName": "Pocahontas"
          },
          {
              "geoID": "54079",
              "countyName": "Putnam"
          },
          {
              "geoID": "54071",
              "countyName": "Pendleton"
          },
          {
              "geoID": "54067",
              "countyName": "Nicholas"
          },
          {
              "geoID": "54101",
              "countyName": "Webster"
          },
          {
              "geoID": "54063",
              "countyName": "Monroe"
          },
          {
              "geoID": "54103",
              "countyName": "Wetzel"
          },
          {
              "geoID": "54033",
              "countyName": "Harrison"
          },
          {
              "geoID": "54055",
              "countyName": "Mercer"
          },
          {
              "geoID": "54043",
              "countyName": "Lincoln"
          },
          {
              "geoID": "54027",
              "countyName": "Hampshire"
          },
          {
              "geoID": "54017",
              "countyName": "Doddridge"
          },
          {
              "geoID": "54001",
              "countyName": "Barbour"
          },
          {
              "geoID": "54077",
              "countyName": "Preston"
          },
          {
              "geoID": "54045",
              "countyName": "Logan"
          },
          {
              "geoID": "54041",
              "countyName": "Lewis"
          },
          {
              "geoID": "54035",
              "countyName": "Jackson"
          },
          {
              "geoID": "54019",
              "countyName": "Fayette"
          },
          {
              "geoID": "54023",
              "countyName": "Grant"
          },
          {
              "geoID": "54021",
              "countyName": "Gilmer"
          },
          {
              "geoID": "54007",
              "countyName": "Braxton"
          }
      ]
  },
  {
      "id": 55,
      "name": "Wisconsin",
      "counties": [
          {
              "geoID": "55141",
              "countyName": "Wood"
          },
          {
              "geoID": "55099",
              "countyName": "Price"
          },
          {
              "geoID": "55069",
              "countyName": "Lincoln"
          },
          {
              "geoID": "55025",
              "countyName": "Dane"
          },
          {
              "geoID": "55049",
              "countyName": "Iowa"
          },
          {
              "geoID": "55027",
              "countyName": "Dodge"
          },
          {
              "geoID": "55011",
              "countyName": "Buffalo"
          },
          {
              "geoID": "55015",
              "countyName": "Calumet"
          },
          {
              "geoID": "55105",
              "countyName": "Rock"
          },
          {
              "geoID": "55047",
              "countyName": "Green Lake"
          },
          {
              "geoID": "55087",
              "countyName": "Outagamie"
          },
          {
              "geoID": "55055",
              "countyName": "Jefferson"
          },
          {
              "geoID": "55107",
              "countyName": "Rusk"
          },
          {
              "geoID": "55067",
              "countyName": "Langlade"
          },
          {
              "geoID": "55083",
              "countyName": "Oconto"
          },
          {
              "geoID": "55125",
              "countyName": "Vilas"
          },
          {
              "geoID": "55129",
              "countyName": "Washburn"
          },
          {
              "geoID": "55077",
              "countyName": "Marquette"
          },
          {
              "geoID": "55043",
              "countyName": "Grant"
          },
          {
              "geoID": "55121",
              "countyName": "Trempealeau"
          },
          {
              "geoID": "55001",
              "countyName": "Adams"
          },
          {
              "geoID": "55119",
              "countyName": "Taylor"
          },
          {
              "geoID": "55045",
              "countyName": "Green"
          },
          {
              "geoID": "55019",
              "countyName": "Clark"
          },
          {
              "geoID": "55111",
              "countyName": "Sauk"
          },
          {
              "geoID": "55081",
              "countyName": "Monroe"
          },
          {
              "geoID": "55093",
              "countyName": "Pierce"
          },
          {
              "geoID": "55075",
              "countyName": "Marinette"
          },
          {
              "geoID": "55089",
              "countyName": "Ozaukee"
          },
          {
              "geoID": "55057",
              "countyName": "Juneau"
          },
          {
              "geoID": "55005",
              "countyName": "Barron"
          },
          {
              "geoID": "55051",
              "countyName": "Iron"
          },
          {
              "geoID": "55033",
              "countyName": "Dunn"
          },
          {
              "geoID": "55031",
              "countyName": "Douglas"
          },
          {
              "geoID": "55127",
              "countyName": "Walworth"
          },
          {
              "geoID": "55078",
              "countyName": "Menominee"
          },
          {
              "geoID": "55037",
              "countyName": "Florence"
          },
          {
              "geoID": "55091",
              "countyName": "Pepin"
          },
          {
              "geoID": "55079",
              "countyName": "Milwaukee"
          },
          {
              "geoID": "55085",
              "countyName": "Oneida"
          },
          {
              "geoID": "55023",
              "countyName": "Crawford"
          },
          {
              "geoID": "55061",
              "countyName": "Kewaunee"
          },
          {
              "geoID": "55009",
              "countyName": "Brown"
          },
          {
              "geoID": "55071",
              "countyName": "Manitowoc"
          },
          {
              "geoID": "55029",
              "countyName": "Door"
          },
          {
              "geoID": "55137",
              "countyName": "Waushara"
          },
          {
              "geoID": "55115",
              "countyName": "Shawano"
          },
          {
              "geoID": "55095",
              "countyName": "Polk"
          },
          {
              "geoID": "55007",
              "countyName": "Bayfield"
          },
          {
              "geoID": "55003",
              "countyName": "Ashland"
          },
          {
              "geoID": "55013",
              "countyName": "Burnett"
          },
          {
              "geoID": "55133",
              "countyName": "Waukesha"
          },
          {
              "geoID": "55053",
              "countyName": "Jackson"
          },
          {
              "geoID": "55103",
              "countyName": "Richland"
          },
          {
              "geoID": "55065",
              "countyName": "Lafayette"
          },
          {
              "geoID": "55063",
              "countyName": "La Crosse"
          },
          {
              "geoID": "55109",
              "countyName": "St. Croix"
          },
          {
              "geoID": "55039",
              "countyName": "Fond du Lac"
          },
          {
              "geoID": "55113",
              "countyName": "Sawyer"
          },
          {
              "geoID": "55041",
              "countyName": "Forest"
          },
          {
              "geoID": "55017",
              "countyName": "Chippewa"
          },
          {
              "geoID": "55021",
              "countyName": "Columbia"
          },
          {
              "geoID": "55123",
              "countyName": "Vernon"
          },
          {
              "geoID": "55135",
              "countyName": "Waupaca"
          },
          {
              "geoID": "55139",
              "countyName": "Winnebago"
          },
          {
              "geoID": "55097",
              "countyName": "Portage"
          },
          {
              "geoID": "55035",
              "countyName": "Eau Claire"
          },
          {
              "geoID": "55059",
              "countyName": "Kenosha"
          },
          {
              "geoID": "55131",
              "countyName": "Washington"
          },
          {
              "geoID": "55101",
              "countyName": "Racine"
          },
          {
              "geoID": "55117",
              "countyName": "Sheboygan"
          },
          {
              "geoID": "55073",
              "countyName": "Marathon"
          }
      ]
  },
  {
      "id": 56,
      "name": "Wyoming",
      "counties": [
          {
              "geoID": "56045",
              "countyName": "Weston"
          },
          {
              "geoID": "56041",
              "countyName": "Uinta"
          },
          {
              "geoID": "56021",
              "countyName": "Laramie"
          },
          {
              "geoID": "56019",
              "countyName": "Johnson"
          },
          {
              "geoID": "56001",
              "countyName": "Albany"
          },
          {
              "geoID": "56029",
              "countyName": "Park"
          },
          {
              "geoID": "56003",
              "countyName": "Big Horn"
          },
          {
              "geoID": "56037",
              "countyName": "Sweetwater"
          },
          {
              "geoID": "56025",
              "countyName": "Natrona"
          },
          {
              "geoID": "56009",
              "countyName": "Converse"
          },
          {
              "geoID": "56017",
              "countyName": "Hot Springs"
          },
          {
              "geoID": "56043",
              "countyName": "Washakie"
          },
          {
              "geoID": "56035",
              "countyName": "Sublette"
          },
          {
              "geoID": "56007",
              "countyName": "Carbon"
          },
          {
              "geoID": "56011",
              "countyName": "Crook"
          },
          {
              "geoID": "56039",
              "countyName": "Teton"
          },
          {
              "geoID": "56013",
              "countyName": "Fremont"
          },
          {
              "geoID": "56015",
              "countyName": "Goshen"
          },
          {
              "geoID": "56023",
              "countyName": "Lincoln"
          },
          {
              "geoID": "56027",
              "countyName": "Niobrara"
          },
          {
              "geoID": "56031",
              "countyName": "Platte"
          },
          {
              "geoID": "56005",
              "countyName": "Campbell"
          },
          {
              "geoID": "56033",
              "countyName": "Sheridan"
          }
      ]
  },
  {
      "id": 1,
      "name": "Alabama",
      "counties": [
          {
              "geoID": "01023",
              "countyName": "Choctaw"
          },
          {
              "geoID": "01053",
              "countyName": "Escambia"
          },
          {
              "geoID": "01021",
              "countyName": "Chilton"
          },
          {
              "geoID": "01093",
              "countyName": "Marion"
          },
          {
              "geoID": "01007",
              "countyName": "Bibb"
          },
          {
              "geoID": "01103",
              "countyName": "Morgan"
          },
          {
              "geoID": "01133",
              "countyName": "Winston"
          },
          {
              "geoID": "01131",
              "countyName": "Wilcox"
          },
          {
              "geoID": "01107",
              "countyName": "Pickens"
          },
          {
              "geoID": "01083",
              "countyName": "Limestone"
          },
          {
              "geoID": "01017",
              "countyName": "Chambers"
          },
          {
              "geoID": "01055",
              "countyName": "Etowah"
          },
          {
              "geoID": "01031",
              "countyName": "Coffee"
          },
          {
              "geoID": "01075",
              "countyName": "Lamar"
          },
          {
              "geoID": "01059",
              "countyName": "Franklin"
          },
          {
              "geoID": "01121",
              "countyName": "Talladega"
          },
          {
              "geoID": "01041",
              "countyName": "Crenshaw"
          },
          {
              "geoID": "01045",
              "countyName": "Dale"
          },
          {
              "geoID": "01125",
              "countyName": "Tuscaloosa"
          },
          {
              "geoID": "01011",
              "countyName": "Bullock"
          },
          {
              "geoID": "01039",
              "countyName": "Covington"
          },
          {
              "geoID": "01019",
              "countyName": "Cherokee"
          },
          {
              "geoID": "01049",
              "countyName": "DeKalb"
          },
          {
              "geoID": "01101",
              "countyName": "Montgomery"
          },
          {
              "geoID": "01087",
              "countyName": "Macon"
          },
          {
              "geoID": "01047",
              "countyName": "Dallas"
          },
          {
              "geoID": "01119",
              "countyName": "Sumter"
          },
          {
              "geoID": "01067",
              "countyName": "Henry"
          },
          {
              "geoID": "01043",
              "countyName": "Cullman"
          },
          {
              "geoID": "01095",
              "countyName": "Marshall"
          },
          {
              "geoID": "01009",
              "countyName": "Blount"
          },
          {
              "geoID": "01085",
              "countyName": "Lowndes"
          },
          {
              "geoID": "01081",
              "countyName": "Lee"
          },
          {
              "geoID": "01057",
              "countyName": "Fayette"
          },
          {
              "geoID": "01003",
              "countyName": "Baldwin"
          },
          {
              "geoID": "01111",
              "countyName": "Randolph"
          },
          {
              "geoID": "01127",
              "countyName": "Walker"
          },
          {
              "geoID": "01073",
              "countyName": "Jefferson"
          },
          {
              "geoID": "01025",
              "countyName": "Clarke"
          },
          {
              "geoID": "01091",
              "countyName": "Marengo"
          },
          {
              "geoID": "01065",
              "countyName": "Hale"
          },
          {
              "geoID": "01037",
              "countyName": "Coosa"
          },
          {
              "geoID": "01005",
              "countyName": "Barbour"
          },
          {
              "geoID": "01097",
              "countyName": "Mobile"
          },
          {
              "geoID": "01115",
              "countyName": "St. Clair"
          },
          {
              "geoID": "01063",
              "countyName": "Greene"
          },
          {
              "geoID": "01089",
              "countyName": "Madison"
          },
          {
              "geoID": "01071",
              "countyName": "Jackson"
          },
          {
              "geoID": "01029",
              "countyName": "Cleburne"
          },
          {
              "geoID": "01051",
              "countyName": "Elmore"
          },
          {
              "geoID": "01123",
              "countyName": "Tallapoosa"
          },
          {
              "geoID": "01035",
              "countyName": "Conecuh"
          },
          {
              "geoID": "01113",
              "countyName": "Russell"
          },
          {
              "geoID": "01109",
              "countyName": "Pike"
          },
          {
              "geoID": "01027",
              "countyName": "Clay"
          },
          {
              "geoID": "01129",
              "countyName": "Washington"
          },
          {
              "geoID": "01079",
              "countyName": "Lawrence"
          },
          {
              "geoID": "01099",
              "countyName": "Monroe"
          },
          {
              "geoID": "01077",
              "countyName": "Lauderdale"
          },
          {
              "geoID": "01033",
              "countyName": "Colbert"
          },
          {
              "geoID": "01069",
              "countyName": "Houston"
          },
          {
              "geoID": "01061",
              "countyName": "Geneva"
          },
          {
              "geoID": "01015",
              "countyName": "Calhoun"
          },
          {
              "geoID": "01013",
              "countyName": "Butler"
          },
          {
              "geoID": "01105",
              "countyName": "Perry"
          },
          {
              "geoID": "01001",
              "countyName": "Autauga"
          },
          {
              "geoID": "01117",
              "countyName": "Shelby"
          }
      ]
  },
  {
      "id": 2,
      "name": "Alaska",
      "counties": []
  },
  {
      "id": 4,
      "name": "Arizona",
      "counties": [
          {
              "geoID": "04011",
              "countyName": "Greenlee"
          },
          {
              "geoID": "04023",
              "countyName": "Santa Cruz"
          },
          {
              "geoID": "04017",
              "countyName": "Navajo"
          },
          {
              "geoID": "04021",
              "countyName": "Pinal"
          },
          {
              "geoID": "04009",
              "countyName": "Graham"
          },
          {
              "geoID": "04001",
              "countyName": "Apache"
          },
          {
              "geoID": "04027",
              "countyName": "Yuma"
          },
          {
              "geoID": "04003",
              "countyName": "Cochise"
          },
          {
              "geoID": "04019",
              "countyName": "Pima"
          },
          {
              "geoID": "04015",
              "countyName": "Mohave"
          },
          {
              "geoID": "04005",
              "countyName": "Coconino"
          },
          {
              "geoID": "04007",
              "countyName": "Gila"
          },
          {
              "geoID": "04012",
              "countyName": "La Paz"
          },
          {
              "geoID": "04013",
              "countyName": "Maricopa"
          },
          {
              "geoID": "04025",
              "countyName": "Yavapai"
          }
      ]
  },
  {
      "id": 5,
      "name": "Arkansas",
      "counties": [
          {
              "geoID": "05099",
              "countyName": "Nevada"
          },
          {
              "geoID": "05067",
              "countyName": "Jackson"
          },
          {
              "geoID": "05111",
              "countyName": "Poinsett"
          },
          {
              "geoID": "05037",
              "countyName": "Cross"
          },
          {
              "geoID": "05101",
              "countyName": "Newton"
          },
          {
              "geoID": "05009",
              "countyName": "Boone"
          },
          {
              "geoID": "05109",
              "countyName": "Pike"
          },
          {
              "geoID": "05045",
              "countyName": "Faulkner"
          },
          {
              "geoID": "05051",
              "countyName": "Garland"
          },
          {
              "geoID": "05053",
              "countyName": "Grant"
          },
          {
              "geoID": "05127",
              "countyName": "Scott"
          },
          {
              "geoID": "05149",
              "countyName": "Yell"
          },
          {
              "geoID": "05025",
              "countyName": "Cleveland"
          },
          {
              "geoID": "05043",
              "countyName": "Drew"
          },
          {
              "geoID": "05137",
              "countyName": "Stone"
          },
          {
              "geoID": "05141",
              "countyName": "Van Buren"
          },
          {
              "geoID": "05011",
              "countyName": "Bradley"
          },
          {
              "geoID": "05057",
              "countyName": "Hempstead"
          },
          {
              "geoID": "05027",
              "countyName": "Columbia"
          },
          {
              "geoID": "05031",
              "countyName": "Craighead"
          },
          {
              "geoID": "05095",
              "countyName": "Monroe"
          },
          {
              "geoID": "05039",
              "countyName": "Dallas"
          },
          {
              "geoID": "05129",
              "countyName": "Searcy"
          },
          {
              "geoID": "05003",
              "countyName": "Ashley"
          },
          {
              "geoID": "05089",
              "countyName": "Marion"
          },
          {
              "geoID": "05093",
              "countyName": "Mississippi"
          },
          {
              "geoID": "05061",
              "countyName": "Howard"
          },
          {
              "geoID": "05147",
              "countyName": "Woodruff"
          },
          {
              "geoID": "05133",
              "countyName": "Sevier"
          },
          {
              "geoID": "05013",
              "countyName": "Calhoun"
          },
          {
              "geoID": "05055",
              "countyName": "Greene"
          },
          {
              "geoID": "05041",
              "countyName": "Desha"
          },
          {
              "geoID": "05105",
              "countyName": "Perry"
          },
          {
              "geoID": "05007",
              "countyName": "Benton"
          },
          {
              "geoID": "05073",
              "countyName": "Lafayette"
          },
          {
              "geoID": "05115",
              "countyName": "Pope"
          },
          {
              "geoID": "05005",
              "countyName": "Baxter"
          },
          {
              "geoID": "05123",
              "countyName": "St. Francis"
          },
          {
              "geoID": "05001",
              "countyName": "Arkansas"
          },
          {
              "geoID": "05143",
              "countyName": "Washington"
          },
          {
              "geoID": "05117",
              "countyName": "Prairie"
          },
          {
              "geoID": "05131",
              "countyName": "Sebastian"
          },
          {
              "geoID": "05021",
              "countyName": "Clay"
          },
          {
              "geoID": "05023",
              "countyName": "Cleburne"
          },
          {
              "geoID": "05029",
              "countyName": "Conway"
          },
          {
              "geoID": "05033",
              "countyName": "Crawford"
          },
          {
              "geoID": "05047",
              "countyName": "Franklin"
          },
          {
              "geoID": "05071",
              "countyName": "Johnson"
          },
          {
              "geoID": "05087",
              "countyName": "Madison"
          },
          {
              "geoID": "05059",
              "countyName": "Hot Spring"
          },
          {
              "geoID": "05063",
              "countyName": "Independence"
          },
          {
              "geoID": "05075",
              "countyName": "Lawrence"
          },
          {
              "geoID": "05081",
              "countyName": "Little River"
          },
          {
              "geoID": "05125",
              "countyName": "Saline"
          },
          {
              "geoID": "05113",
              "countyName": "Polk"
          },
          {
              "geoID": "05135",
              "countyName": "Sharp"
          },
          {
              "geoID": "05119",
              "countyName": "Pulaski"
          },
          {
              "geoID": "05085",
              "countyName": "Lonoke"
          },
          {
              "geoID": "05091",
              "countyName": "Miller"
          },
          {
              "geoID": "05049",
              "countyName": "Fulton"
          },
          {
              "geoID": "05035",
              "countyName": "Crittenden"
          },
          {
              "geoID": "05121",
              "countyName": "Randolph"
          },
          {
              "geoID": "05097",
              "countyName": "Montgomery"
          },
          {
              "geoID": "05107",
              "countyName": "Phillips"
          },
          {
              "geoID": "05065",
              "countyName": "Izard"
          },
          {
              "geoID": "05015",
              "countyName": "Carroll"
          },
          {
              "geoID": "05077",
              "countyName": "Lee"
          },
          {
              "geoID": "05079",
              "countyName": "Lincoln"
          },
          {
              "geoID": "05069",
              "countyName": "Jefferson"
          },
          {
              "geoID": "05145",
              "countyName": "White"
          },
          {
              "geoID": "05103",
              "countyName": "Ouachita"
          },
          {
              "geoID": "05083",
              "countyName": "Logan"
          },
          {
              "geoID": "05019",
              "countyName": "Clark"
          },
          {
              "geoID": "05139",
              "countyName": "Union"
          },
          {
              "geoID": "05017",
              "countyName": "Chicot"
          }
      ]
  },
  {
      "id": 6,
      "name": "California",
      "counties": [
          {
              "geoID": "06075",
              "countyName": "San Francisco"
          },
          {
              "geoID": "06087",
              "countyName": "Santa Cruz"
          },
          {
              "geoID": "06031",
              "countyName": "Kings"
          },
          {
              "geoID": "06085",
              "countyName": "Santa Clara"
          },
          {
              "geoID": "06021",
              "countyName": "Glenn"
          },
          {
              "geoID": "06107",
              "countyName": "Tulare"
          },
          {
              "geoID": "06037",
              "countyName": "Los Angeles"
          },
          {
              "geoID": "06097",
              "countyName": "Sonoma"
          },
          {
              "geoID": "06065",
              "countyName": "Riverside"
          },
          {
              "geoID": "06041",
              "countyName": "Marin"
          },
          {
              "geoID": "06073",
              "countyName": "San Diego"
          },
          {
              "geoID": "06029",
              "countyName": "Kern"
          },
          {
              "geoID": "06043",
              "countyName": "Mariposa"
          },
          {
              "geoID": "06081",
              "countyName": "San Mateo"
          },
          {
              "geoID": "06111",
              "countyName": "Ventura"
          },
          {
              "geoID": "06025",
              "countyName": "Imperial"
          },
          {
              "geoID": "06017",
              "countyName": "El Dorado"
          },
          {
              "geoID": "06059",
              "countyName": "Orange"
          },
          {
              "geoID": "06053",
              "countyName": "Monterey"
          },
          {
              "geoID": "06013",
              "countyName": "Contra Costa"
          },
          {
              "geoID": "06099",
              "countyName": "Stanislaus"
          },
          {
              "geoID": "06023",
              "countyName": "Humboldt"
          },
          {
              "geoID": "06027",
              "countyName": "Inyo"
          },
          {
              "geoID": "06093",
              "countyName": "Siskiyou"
          },
          {
              "geoID": "06009",
              "countyName": "Calaveras"
          },
          {
              "geoID": "06115",
              "countyName": "Yuba"
          },
          {
              "geoID": "06047",
              "countyName": "Merced"
          },
          {
              "geoID": "06033",
              "countyName": "Lake"
          },
          {
              "geoID": "06039",
              "countyName": "Madera"
          },
          {
              "geoID": "06049",
              "countyName": "Modoc"
          },
          {
              "geoID": "06063",
              "countyName": "Plumas"
          },
          {
              "geoID": "06103",
              "countyName": "Tehama"
          },
          {
              "geoID": "06057",
              "countyName": "Nevada"
          },
          {
              "geoID": "06113",
              "countyName": "Yolo"
          },
          {
              "geoID": "06051",
              "countyName": "Mono"
          },
          {
              "geoID": "06083",
              "countyName": "Santa Barbara"
          },
          {
              "geoID": "06089",
              "countyName": "Shasta"
          },
          {
              "geoID": "06069",
              "countyName": "San Benito"
          },
          {
              "geoID": "06067",
              "countyName": "Sacramento"
          },
          {
              "geoID": "06071",
              "countyName": "San Bernardino"
          },
          {
              "geoID": "06105",
              "countyName": "Trinity"
          },
          {
              "geoID": "06003",
              "countyName": "Alpine"
          },
          {
              "geoID": "06109",
              "countyName": "Tuolumne"
          },
          {
              "geoID": "06045",
              "countyName": "Mendocino"
          },
          {
              "geoID": "06011",
              "countyName": "Colusa"
          },
          {
              "geoID": "06015",
              "countyName": "Del Norte"
          },
          {
              "geoID": "06095",
              "countyName": "Solano"
          },
          {
              "geoID": "06035",
              "countyName": "Lassen"
          },
          {
              "geoID": "06061",
              "countyName": "Placer"
          },
          {
              "geoID": "06007",
              "countyName": "Butte"
          },
          {
              "geoID": "06019",
              "countyName": "Fresno"
          },
          {
              "geoID": "06077",
              "countyName": "San Joaquin"
          },
          {
              "geoID": "06005",
              "countyName": "Amador"
          },
          {
              "geoID": "06091",
              "countyName": "Sierra"
          },
          {
              "geoID": "06101",
              "countyName": "Sutter"
          },
          {
              "geoID": "06079",
              "countyName": "San Luis Obispo"
          },
          {
              "geoID": "06055",
              "countyName": "Napa"
          },
          {
              "geoID": "06001",
              "countyName": "Alameda"
          }
      ]
  },
  {
      "id": 8,
      "name": "Colorado",
      "counties": [
          {
              "geoID": "08014",
              "countyName": "Broomfield"
          },
          {
              "geoID": "08045",
              "countyName": "Garfield"
          },
          {
              "geoID": "08119",
              "countyName": "Teller"
          },
          {
              "geoID": "08081",
              "countyName": "Moffat"
          },
          {
              "geoID": "08087",
              "countyName": "Morgan"
          },
          {
              "geoID": "08105",
              "countyName": "Rio Grande"
          },
          {
              "geoID": "08091",
              "countyName": "Ouray"
          },
          {
              "geoID": "08043",
              "countyName": "Fremont"
          },
          {
              "geoID": "08035",
              "countyName": "Douglas"
          },
          {
              "geoID": "08033",
              "countyName": "Dolores"
          },
          {
              "geoID": "08013",
              "countyName": "Boulder"
          },
          {
              "geoID": "08095",
              "countyName": "Phillips"
          },
          {
              "geoID": "08041",
              "countyName": "El Paso"
          },
          {
              "geoID": "08027",
              "countyName": "Custer"
          },
          {
              "geoID": "08083",
              "countyName": "Montezuma"
          },
          {
              "geoID": "08037",
              "countyName": "Eagle"
          },
          {
              "geoID": "08097",
              "countyName": "Pitkin"
          },
          {
              "geoID": "08125",
              "countyName": "Yuma"
          },
          {
              "geoID": "08075",
              "countyName": "Logan"
          },
          {
              "geoID": "08025",
              "countyName": "Crowley"
          },
          {
              "geoID": "08079",
              "countyName": "Mineral"
          },
          {
              "geoID": "08007",
              "countyName": "Archuleta"
          },
          {
              "geoID": "08055",
              "countyName": "Huerfano"
          },
          {
              "geoID": "08103",
              "countyName": "Rio Blanco"
          },
          {
              "geoID": "08121",
              "countyName": "Washington"
          },
          {
              "geoID": "08059",
              "countyName": "Jefferson"
          },
          {
              "geoID": "08001",
              "countyName": "Adams"
          },
          {
              "geoID": "08019",
              "countyName": "Clear Creek"
          },
          {
              "geoID": "08005",
              "countyName": "Arapahoe"
          },
          {
              "geoID": "08047",
              "countyName": "Gilpin"
          },
          {
              "geoID": "08011",
              "countyName": "Bent"
          },
          {
              "geoID": "08061",
              "countyName": "Kiowa"
          },
          {
              "geoID": "08065",
              "countyName": "Lake"
          },
          {
              "geoID": "08071",
              "countyName": "Las Animas"
          },
          {
              "geoID": "08109",
              "countyName": "Saguache"
          },
          {
              "geoID": "08051",
              "countyName": "Gunnison"
          },
          {
              "geoID": "08049",
              "countyName": "Grand"
          },
          {
              "geoID": "08053",
              "countyName": "Hinsdale"
          },
          {
              "geoID": "08063",
              "countyName": "Kit Carson"
          },
          {
              "geoID": "08009",
              "countyName": "Baca"
          },
          {
              "geoID": "08021",
              "countyName": "Conejos"
          },
          {
              "geoID": "08111",
              "countyName": "San Juan"
          },
          {
              "geoID": "08115",
              "countyName": "Sedgwick"
          },
          {
              "geoID": "08085",
              "countyName": "Montrose"
          },
          {
              "geoID": "08107",
              "countyName": "Routt"
          },
          {
              "geoID": "08003",
              "countyName": "Alamosa"
          },
          {
              "geoID": "08057",
              "countyName": "Jackson"
          },
          {
              "geoID": "08031",
              "countyName": "Denver"
          },
          {
              "geoID": "08117",
              "countyName": "Summit"
          },
          {
              "geoID": "08069",
              "countyName": "Larimer"
          },
          {
              "geoID": "08093",
              "countyName": "Park"
          },
          {
              "geoID": "08015",
              "countyName": "Chaffee"
          },
          {
              "geoID": "08113",
              "countyName": "San Miguel"
          },
          {
              "geoID": "08089",
              "countyName": "Otero"
          },
          {
              "geoID": "08017",
              "countyName": "Cheyenne"
          },
          {
              "geoID": "08073",
              "countyName": "Lincoln"
          },
          {
              "geoID": "08029",
              "countyName": "Delta"
          },
          {
              "geoID": "08099",
              "countyName": "Prowers"
          },
          {
              "geoID": "08101",
              "countyName": "Pueblo"
          },
          {
              "geoID": "08123",
              "countyName": "Weld"
          },
          {
              "geoID": "08077",
              "countyName": "Mesa"
          },
          {
              "geoID": "08067",
              "countyName": "La Plata"
          },
          {
              "geoID": "08023",
              "countyName": "Costilla"
          },
          {
              "geoID": "08039",
              "countyName": "Elbert"
          }
      ]
  },
  {
      "id": 9,
      "name": "Connecticut",
      "counties": [
          {
              "geoID": "09013",
              "countyName": "Tolland"
          },
          {
              "geoID": "09015",
              "countyName": "Windham"
          },
          {
              "geoID": "09003",
              "countyName": "Hartford"
          },
          {
              "geoID": "09007",
              "countyName": "Middlesex"
          },
          {
              "geoID": "09001",
              "countyName": "Fairfield"
          },
          {
              "geoID": "09009",
              "countyName": "New Haven"
          },
          {
              "geoID": "09005",
              "countyName": "Litchfield"
          },
          {
              "geoID": "09011",
              "countyName": "New London"
          }
      ]
  }
]
const sortedUSStates = USStates.sort((a, b) => {
  // Always keep "US" at the top
  if (a.name === "US") return -1;
  if (b.name === "US") return 1;
  
  // For all other states, sort alphabetically
  return a.name.localeCompare(b.name);
});
export const useMapStore = create<MapState>((set, get) => ({
  selectedState: { id: 0, name: "US" },
  selectedCounties: [],
  data: [],
  filteredData: [],
  colorScale: createColorScale(),
  setSelectedState: (state) => {
    set({ selectedState: state });
    const { data } = get();
    const filtered = state.name === "US" 
      ? data 
      : data.filter((d) => d.state === state.name);
    set({ filteredData: filtered });
  },
  updateSelectedCounties: (counties) => set({ selectedCounties: counties }),
  USStates: sortedUSStates,
  fetchData: async () => {
    const loadedData = await csv("/data.csv");
    const processedData = loadedData.map((d) => ({
      ...d,
      xValue: +d.xValue,
      yValue: +d.yValue,
      gap: +d.gap,
      radius: 3,
      isBrushed: false,
    }));
    set({ data: processedData, filteredData: processedData });
  },
  filterDataByState: (stateName) => {
    const { data } = get();
    const filtered =
      stateName === "US" ? data : data.filter((d) => d.state === stateName);
    set({ filteredData: filtered });
  },
}));
