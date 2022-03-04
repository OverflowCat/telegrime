use std::collections::HashMap;
use std::fmt::{Error, Formatter};
use std::fs::File;
use std::io::{self, prelude::*, BufReader};

type EntryK = (String, u16);
type EntryV = String;
type TableMap = HashMap<EntryK, EntryV>;

pub struct Mabiao {
    code_length: u8,
    count: u128,
    table: TableMap,
}

impl Mabiao {
    pub fn new(table: TableMap, code_length: u8) -> Self {
        Mabiao {
            code_length,
            count: table.len() as u128,
            table,
        }
    }
    pub fn lookup(&self, key: &EntryK) -> Option<&EntryV> {
        self.table.get(key)
    }
}

impl std::fmt::Debug for Mabiao {
    fn fmt(&self, f: &mut Formatter) -> Result<(), Error> {
        write!(
            f,
            "Mabiao {{ code_length: {}, count: {}, table: {:?} }}",
            self.code_length, self.count, self.table
        )
    }
}

pub fn flypy() -> Result<Mabiao, io::Error> {
    println!("Hello, world!");
    let result = read_from_file("../assets/flypy.txt")?;
    Ok(result)
}

fn parse_entry(line: String) -> Option<(String, u16, String)> {
    // aaaa=1234,bbbb
    let mut iter = line.splitn(2, '=');
    let code = iter.next()?;
    let value = iter.next()?;
    let mut iter = value.splitn(2, ',');
    let priority = iter.next()?;
    let priority: u16 = priority.parse().unwrap();
    let content = iter.next()?;
    Some((code.to_string(), priority, content.to_string()))
}

fn read_from_file(path: &str) -> io::Result<Mabiao> {
    let mut codes: HashMap<EntryK, EntryV> = HashMap::new();
    let f = File::open(path)?;
    let reader = BufReader::new(f);
    let mut counter: u128 = 0;
    for line in reader.lines() {
        let line = line?;
        let result = parse_entry(line);
        match result {
            Some((code, priority, content)) => {
                codes.insert((code, priority), content);
                counter += 1;
            }
            None => {}
        }
    }
    println!("{:?}", codes);
    Ok(Mabiao {
        code_length: 4,
        count: counter,
        table: codes,
    })
}
