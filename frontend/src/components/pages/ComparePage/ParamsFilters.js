export function ChangeFilter(modelConfig, setModelConfig, name, value) {
    setModelConfig({
        ...modelConfig,
        [name]: value,
    });
}

export function GetFilteredConfigurations(configurations, modelConfig, skipFilter) {
    if (!configurations) {
        return [];
    }

    return configurations.filter((config) => {
        if (skipFilter !== "generation" && modelConfig.generation !== "") {
            if (config.generacja_id != modelConfig.generation) return false;
        }

        if (skipFilter !== "year" && modelConfig.year !== "") {
            if (!(Number(config.rok_od) <= Number(modelConfig.year) && Number(config.rok_do) >= Number(modelConfig.year))) {
                return false;
            }
        }

        if (skipFilter !== "engine" && modelConfig.engine !== "") {
            if (config.silnik_id != modelConfig.engine) return false;
        }

        if (skipFilter !== "body" && modelConfig.body !== "") {
            if (config.nadwozie_id != modelConfig.body) return false;
        }

        if (skipFilter !== "drive" && modelConfig.drive !== "") {
            if (config.naped_id != modelConfig.drive) return false;
        }

        if (skipFilter !== "gearbox" && modelConfig.gearbox !== "") {
            if (config.skrzynia_id != modelConfig.gearbox) return false;
        }

        return true;
    });
}

export function GetGenerations(configurations, modelConfig) {
    let filteredConfigurations = GetFilteredConfigurations(configurations, modelConfig, "generation");
    let generations = [];

    filteredConfigurations.forEach((config) => {
        let alreadyExists = generations.some((generation) => generation.id == config.generacja_id);

        if (alreadyExists == false) {
            generations.push({
                id: config.generacja_id,
                name: config.generacja,
            });
        }
    });

    return generations;
}

export function GetYears(configurations, modelConfig) {
    let filteredConfigurations = GetFilteredConfigurations(configurations, modelConfig, "year");
    let years = [];

    filteredConfigurations.forEach((config) => {
        for (let year = Number(config.rok_od); year <= Number(config.rok_do); year++) {
            if (!years.includes(year)) {
                years.push(year);
            }
        }
    });

    return years.sort();
}

export function GetEngines(configurations, modelConfig) {
    let filteredConfigurations = GetFilteredConfigurations(configurations, modelConfig, "engine");
    let engines = [];

    filteredConfigurations.forEach((config) => {
        let alreadyExists = engines.some((engine) => engine.id == config.silnik_id);

        if (alreadyExists == false) {
            engines.push({
                id: config.silnik_id,
                kod: config.silnik_kod,
                nazwa: config.silnik_nazwa,
                pojemnosc: config.pojemnosc_cm3,
            });
        }
    });

    return engines;
}

export function GetBodies(configurations, modelConfig) {
    let filteredConfigurations = GetFilteredConfigurations(configurations, modelConfig, "body");
    let bodies = [];

    filteredConfigurations.forEach((config) => {
        let alreadyExists = bodies.some((body) => body.id == config.nadwozie_id);

        if (alreadyExists == false) {
            bodies.push({
                id: config.nadwozie_id,
                name: config.nadwozie,
            });
        }
    });

    return bodies;
}

export function GetDrives(configurations, modelConfig) {
    let filteredConfigurations = GetFilteredConfigurations(configurations, modelConfig, "drive");
    let drives = [];

    filteredConfigurations.forEach((config) => {
        let alreadyExists = drives.some((drive) => drive.id == config.naped_id);

        if (alreadyExists == false) {
            drives.push({
                id: config.naped_id,
                name: config.naped,
            });
        }
    });

    return drives;
}

export function GetGearboxes(configurations, modelConfig) {
    let filteredConfigurations = GetFilteredConfigurations(configurations, modelConfig, "gearbox");
    let gearboxes = [];

    filteredConfigurations.forEach((config) => {
        let alreadyExists = gearboxes.some((gearbox) => gearbox.id == config.skrzynia_id);

        if (alreadyExists == false) {
            gearboxes.push({
                id: config.skrzynia_id,
                name: config.skrzynia,
            });
        }
    });

    return gearboxes;
}