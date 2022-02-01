use config::{Config, ConfigError, File};
use serde::{Deserialize, Serialize};
// use serde_json::value::Value;
// use serde::de::DeserializeOwned;
// extern crate serde_value;
pub const CONFIG_FILE_PATH: &str = "./static/src/data/jdrp/character_creation_rules.json";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GameStats {
    pub max_stat: u16,
    pub max_stat_wcl: u16,
    pub max_per_cat: u8,
    pub min_per_cat: u8,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct Class {
    pub warrior: Stats,
    pub mage: Stats,
    pub roublard: Stats,
    pub rodeur: Stats,
    pub monk: Stats,
    pub drood: Stats,
    pub paladin: Stats,
    pub clerc: Stats,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct Race {
    pub half_orc: Stats,
    pub elf: Stats,
    pub human: Stats,
    pub half_elf: Stats,
    pub dwarf: Stats,
    pub saurial: Stats,
    pub cambion: Stats,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct Stats {
    pub strengh: i8,
    pub dexterity: i8,
    pub luck: i8,
    pub willpower: i8,
    pub endurance: i8,
    pub charism: i8,
    pub perception: i8,
    pub education: i8,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Settings {
    pub game_stats: GameStats,
    pub class_stats: Class,
    pub race_stats: Race,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let mut s = Config::new();
        s.merge(File::with_name(CONFIG_FILE_PATH))?;
        s.try_into()
    }
}

//TODO: Render a error here
// impl Race {
//     pub fn get_stats(&self, field: &str) -> Stats {
//         match field {
//             "human" => self.human,
//             "half_orc" => self.half_orc,
//             "elf" => self.elf,
//             "half_elf" => self.half_elf,
//             "dwarf" => self.dwarf,
//             "saurial" => self.saurial,
//             "cambion" => self.cambion,
//             _ => panic!("a"),
//         }
//     }
// }

// impl Class {
//     pub fn get_stats(&self, field: &str) -> Stats {
//         match field {
//             "warrior" => self.warrior,
//             "mage" => self.mage,
//             "roublard" => self.roublard,
//             "rodeur" => self.rodeur,
//             "monk" => self.monk,
//             "drood" => self.drood,
//             "paladin" => self.paladin,
//             "clerc" => self.clerc,
//             _ => panic!("a"),
//         }
//     }
// }
