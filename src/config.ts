import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName : string;
};

export function setUser(config: Config, userName: string): Config {
    if (userName.trim() === "") {
        throw new Error("User name cannot be empty");
    }
    config.currentUserName = userName;
    writeConfig(config);
    return config;
};

export function readConfig(): Config {
    const filepath = getConfigFilePath();
    
    if (!fs.existsSync(filepath)) {
        throw new Error(`Config file not found at ${filepath}`);
    }
    const rawData = fs.readFileSync(filepath, { encoding: 'utf-8' });
    const rawConfig = JSON.parse(rawData);
    try {
        const config = validateConfig(rawConfig);
        return config;
    } catch (error) {
        throw new Error(`Error validating config: ${error}`);
    }
};

function getConfigFilePath(): string {
    const homeDir = os.homedir();
    const configFilePath = path.join(homeDir, "ts_blog_aggregator", "gatorconfig.json");
    return configFilePath;
};

function writeConfig(cfg: Config): void {
    const configFilePath = getConfigFilePath();
    const configDir = path.dirname(configFilePath);
    const rawConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    };
    // Ensure the directory exists
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(configFilePath, JSON.stringify(rawConfig));
};

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig !== 'object' || rawConfig === null) {
        throw new Error('Invalid config: not an object');
    }
    if (typeof rawConfig.db_url !== 'string') {
        throw new Error('Invalid config: db_url must be a string');
    }
     const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: ""
    };
    if (typeof rawConfig.current_user_name === 'string') {
        config.currentUserName = rawConfig.current_user_name;
    }
    return config;
}

// config file structure
//{
//  "db_url": "connection_string_goes_here",
//  "current_user_name": "username_goes_here"
//}