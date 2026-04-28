CREATE DATABASE IF NOT EXISTS autoverse2
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE autoverse2;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- =========================================================
-- SŁOWNIKI
-- =========================================================

-- Tabela słownikowa przechowująca kraje pochodzenia marek samochodów.
-- Używana głównie przez tabelę marka.
CREATE TABLE `kraj` (
                        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                        `nazwa` VARCHAR(60) NOT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `uk_kraj_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca typy nadwozia, np. sedan, coupe, kombi, hatchback.
-- Używana w tabeli generacja_nadwozie do określenia, jakie nadwozia występowały w danej generacji.
CREATE TABLE `typ_nadwozia` (
                                `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                `nazwa` VARCHAR(40) NOT NULL,
                                PRIMARY KEY (`id`),
                                UNIQUE KEY `uk_typ_nadwozia_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca rodzaje napędu, np. FWD, RWD, AWD.
-- Używana w tabeli konfiguracja jako jedna z cech konkretnej wersji samochodu.
CREATE TABLE `naped` (
                         `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                         `nazwa` VARCHAR(30) NOT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `uk_naped_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca rodzaje skrzyń biegów, np. manualna, automatyczna, DSG, CVT.
-- Używana w tabeli konfiguracja jako element konkretnej konfiguracji auta.
CREATE TABLE `skrzynia` (
                            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                            `nazwa` VARCHAR(40) NOT NULL,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uk_skrzynia_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca typy paliwa, np. benzyna, diesel, LPG, hybryda, elektryczny.
-- Używana w tabeli silnik.
CREATE TABLE `typ_paliwa` (
                              `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                              `nazwa` VARCHAR(30) NOT NULL,
                              PRIMARY KEY (`id`),
                              UNIQUE KEY `uk_typ_paliwa_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca ogólną architekturę silnika,
-- np. tłokowy, Wankla, elektryczny, hybrydowy.
-- Używana do ogólnego opisu jednostki napędowej w tabeli silnik.
CREATE TABLE `architektura_silnika` (
                                        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                        `nazwa` VARCHAR(30) NOT NULL,
                                        PRIMARY KEY (`id`),
                                        UNIQUE KEY `uk_architektura_silnika_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca sposób doładowania silnika,
-- np. wolnossący, turbo, twin turbo, kompresor.
-- Używana w tabeli silnik.
CREATE TABLE `doladowanie` (
                               `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                               `nazwa` VARCHAR(30) NOT NULL,
                               PRIMARY KEY (`id`),
                               UNIQUE KEY `uk_doladowanie_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca układ cylindrów,
-- np. R, V, W, bokser.
-- Używana w tabeli silnik jako jedna z cech konstrukcyjnych jednostki.
CREATE TABLE `uklad_cylindrow` (
                                   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                   `nazwa` VARCHAR(30) NOT NULL,
                                   PRIMARY KEY (`id`),
                                   UNIQUE KEY `uk_uklad_cylindrow_nazwa` (`nazwa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela słownikowa przechowująca rynki sprzedaży,
-- np. Europa, USA, Japonia, Global.
-- Rynek jest przypisywany do konfiguracji przez tabelę pośrednią konfiguracja_rynek.
CREATE TABLE `rynek` (
                         `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                         `nazwa` VARCHAR(50) NOT NULL,
                         `kod` VARCHAR(20) DEFAULT NULL,
                         `opis` TEXT DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `uk_rynek_nazwa` (`nazwa`),
                         UNIQUE KEY `uk_rynek_kod` (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- MARKI / MODELE / GENERACJE
-- =========================================================

-- Tabela przechowująca producentów samochodów, np. BMW, Porsche, Nissan.
-- Marka może być powiązana z krajem pochodzenia i posiada wiele modeli.
-- Dodatkowo może być powiązana z silnikami produkowanymi przez daną markę.
CREATE TABLE `marka` (
                         `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                         `nazwa` VARCHAR(60) NOT NULL,
                         `kraj_id` INT UNSIGNED DEFAULT NULL,
                         `opis` TEXT DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `uk_marka_nazwa` (`nazwa`),
                         KEY `idx_marka_kraj_id` (`kraj_id`),
                         CONSTRAINT `fk_marka_kraj`
                             FOREIGN KEY (`kraj_id`) REFERENCES `kraj` (`id`)
                                 ON DELETE SET NULL
                                 ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela przechowująca modele samochodów w obrębie danej marki,
-- np. BMW M3, Nissan Skyline, Porsche 911.
-- Model jest jednostką nadrzędną wobec generacji.
-- Pole slug służy do tworzenia czytelnych adresów URL na stronie.
CREATE TABLE `model` (
                         `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                         `marka_id` INT UNSIGNED NOT NULL,
                         `nazwa` VARCHAR(100) NOT NULL,
                         `slug` VARCHAR(150) NOT NULL,
                         `segment` VARCHAR(50) DEFAULT NULL,
                         `opis` TEXT DEFAULT NULL,
                         `rok_debiutu` SMALLINT UNSIGNED DEFAULT NULL,
                         `rok_zakonczenia` SMALLINT UNSIGNED DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `uk_model_marka_nazwa` (`marka_id`, `nazwa`),
                         UNIQUE KEY `uk_model_slug` (`slug`),
                         KEY `idx_model_marka_id` (`marka_id`),
                         CONSTRAINT `fk_model_marka`
                             FOREIGN KEY (`marka_id`) REFERENCES `marka` (`id`)
                                 ON DELETE CASCADE
                                 ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela przechowująca generacje danego modelu,
-- np. E46, R34, 997.1.
-- Generacja pozwala oddzielić różne etapy rozwoju modelu w czasie.
CREATE TABLE `generacja` (
                             `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                             `model_id` INT UNSIGNED NOT NULL,
                             `nazwa` VARCHAR(100) NOT NULL,
                             `kod` VARCHAR(50) DEFAULT NULL,
                             `rok_od` SMALLINT UNSIGNED NOT NULL,
                             `rok_do` SMALLINT UNSIGNED DEFAULT NULL,
                             `opis` TEXT DEFAULT NULL,
                             PRIMARY KEY (`id`),
                             UNIQUE KEY `uk_generacja_model_nazwa` (`model_id`, `nazwa`),
                             KEY `idx_generacja_model` (`model_id`),
                             CONSTRAINT `fk_generacja_model`
                                 FOREIGN KEY (`model_id`) REFERENCES `model` (`id`)
                                     ON DELETE CASCADE
                                     ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela przechowująca aktualizacje w obrębie generacji,
-- np. facelift, phase 2, modernizacja.
-- Dzięki niej można zapisać jedną lub wiele większych zmian w historii jednej generacji.
-- To rozwiązanie jest lepsze niż pojedyncze pole boolean typu facelift.
CREATE TABLE `aktualizacja_generacji` (
                                          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                          `generacja_id` INT UNSIGNED NOT NULL,
                                          `nazwa` VARCHAR(100) DEFAULT NULL,
                                          `typ` VARCHAR(50) DEFAULT NULL,
                                          `rok_od` SMALLINT UNSIGNED DEFAULT NULL,
                                          `rok_do` SMALLINT UNSIGNED DEFAULT NULL,
                                          `opis` TEXT DEFAULT NULL,
                                          PRIMARY KEY (`id`),
                                          KEY `idx_aktualizacja_generacji_generacja_id` (`generacja_id`),
                                          CONSTRAINT `fk_aktualizacja_generacji_generacja`
                                              FOREIGN KEY (`generacja_id`) REFERENCES `generacja` (`id`)
                                                  ON DELETE CASCADE
                                                  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela pośrednia łącząca generację z typem nadwozia.
-- Określa, jakie nadwozia występowały w konkretnej generacji,
-- np. sedan, coupe, cabrio, kombi.
-- Pozwala też zapisać liczbę drzwi i zakres lat dla danego wariantu nadwozia.
CREATE TABLE `generacja_nadwozie` (
                                      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                      `generacja_id` INT UNSIGNED NOT NULL,
                                      `typ_nadwozia_id` INT UNSIGNED NOT NULL,
                                      `liczba_drzwi` TINYINT UNSIGNED DEFAULT NULL,
                                      `rok_od` SMALLINT UNSIGNED DEFAULT NULL,
                                      `rok_do` SMALLINT UNSIGNED DEFAULT NULL,
                                      `opis` TEXT DEFAULT NULL,
                                      PRIMARY KEY (`id`),
                                      UNIQUE KEY `uk_generacja_nadwozie` (`generacja_id`, `typ_nadwozia_id`, `liczba_drzwi`),
                                      KEY `idx_generacja_nadwozie_generacja_id` (`generacja_id`),
                                      KEY `idx_generacja_nadwozie_typ_nadwozia_id` (`typ_nadwozia_id`),
                                      CONSTRAINT `fk_generacja_nadwozie_generacja`
                                          FOREIGN KEY (`generacja_id`) REFERENCES `generacja` (`id`)
                                              ON DELETE CASCADE
                                              ON UPDATE CASCADE,
                                      CONSTRAINT `fk_generacja_nadwozie_typ`
                                          FOREIGN KEY (`typ_nadwozia_id`) REFERENCES `typ_nadwozia` (`id`)
                                              ON DELETE RESTRICT
                                              ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- SILNIKI
-- =========================================================

-- Tabela przechowująca jednostki napędowe jako osobne byty encyklopedyczne.
-- Zawiera dane techniczne silnika, takie jak kod, pojemność, liczba cylindrów,
-- układ cylindrów, typ paliwa, doładowanie i ogólny zakres mocy/momentu.
-- Silnik może występować w wielu konfiguracjach i w wielu modelach.
CREATE TABLE `silnik` (
                          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                          `marka_id` INT UNSIGNED DEFAULT NULL,
                          `kod` VARCHAR(60) DEFAULT NULL,
                          `nazwa_handlowa` VARCHAR(100) DEFAULT NULL,
                          `architektura_silnika_id` INT UNSIGNED NOT NULL,
                          `typ_paliwa_id` INT UNSIGNED NOT NULL,
                          `doladowanie_id` INT UNSIGNED DEFAULT NULL,
                          `uklad_cylindrow_id` INT UNSIGNED DEFAULT NULL,
                          `pojemnosc_cm3` INT UNSIGNED NOT NULL,
                          `liczba_cylindrow` TINYINT UNSIGNED DEFAULT NULL,
                          `zawory_na_cylinder` TINYINT UNSIGNED DEFAULT NULL,
                          `moc_min_km` SMALLINT UNSIGNED DEFAULT NULL,
                          `moc_max_km` SMALLINT UNSIGNED DEFAULT NULL,
                          `moment_min_nm` SMALLINT UNSIGNED DEFAULT NULL,
                          `moment_max_nm` SMALLINT UNSIGNED DEFAULT NULL,
                          `opis` TEXT DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_silnik_kod` (`kod`),
                          KEY `idx_silnik_marka_id` (`marka_id`),
                          KEY `idx_silnik_architektura_id` (`architektura_silnika_id`),
                          KEY `idx_silnik_typ_paliwa_id` (`typ_paliwa_id`),
                          KEY `idx_silnik_doladowanie_id` (`doladowanie_id`),
                          KEY `idx_silnik_uklad_cylindrow_id` (`uklad_cylindrow_id`),
                          KEY `idx_silnik_pojemnosc` (`pojemnosc_cm3`),
                          KEY `idx_silnik_nazwa_handlowa` (`nazwa_handlowa`),
                          CONSTRAINT `fk_silnik_marka`
                              FOREIGN KEY (`marka_id`) REFERENCES `marka` (`id`)
                                  ON DELETE SET NULL
                                  ON UPDATE CASCADE,
                          CONSTRAINT `fk_silnik_architektura`
                              FOREIGN KEY (`architektura_silnika_id`) REFERENCES `architektura_silnika` (`id`)
                                  ON DELETE RESTRICT
                                  ON UPDATE CASCADE,
                          CONSTRAINT `fk_silnik_paliwo`
                              FOREIGN KEY (`typ_paliwa_id`) REFERENCES `typ_paliwa` (`id`)
                                  ON DELETE RESTRICT
                                  ON UPDATE CASCADE,
                          CONSTRAINT `fk_silnik_doladowanie`
                              FOREIGN KEY (`doladowanie_id`) REFERENCES `doladowanie` (`id`)
                                  ON DELETE SET NULL
                                  ON UPDATE CASCADE,
                          CONSTRAINT `fk_silnik_uklad_cylindrow`
                              FOREIGN KEY (`uklad_cylindrow_id`) REFERENCES `uklad_cylindrow` (`id`)
                                  ON DELETE SET NULL
                                  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- KONFIGURACJE
-- =========================================================

-- Najważniejsza tabela katalogowa.
-- Przechowuje konkretne konfiguracje samochodu, czyli połączenie:
-- generacji/nadwozia, silnika, napędu i skrzyni.
-- To właśnie ten poziom danych jest używany do porównań i prezentacji wersji auta na stronie.
-- Zawiera też szczegółowe parametry wersji, np. moc, moment, spalanie, osiągi i lata produkcji.
CREATE TABLE `konfiguracja` (
                                `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                `generacja_nadwozie_id` INT UNSIGNED NOT NULL,
                                `silnik_id` INT UNSIGNED NOT NULL,
                                `naped_id` INT UNSIGNED NOT NULL,
                                `skrzynia_id` INT UNSIGNED NOT NULL,
                                `nazwa_wersji` VARCHAR(120) DEFAULT NULL,
                                `ilosc_biegow` TINYINT UNSIGNED DEFAULT NULL,
                                `moc_km` SMALLINT UNSIGNED NOT NULL,
                                `moment_nm` SMALLINT UNSIGNED DEFAULT NULL,
                                `przyspieszenie_0_100` DECIMAL(4,1) DEFAULT NULL,
                                `predkosc_max` SMALLINT UNSIGNED DEFAULT NULL,
                                `spalanie_srednie` DECIMAL(4,1) DEFAULT NULL,
                                `spalanie_miasto` DECIMAL(4,1) DEFAULT NULL,
                                `spalanie_trasa` DECIMAL(4,1) DEFAULT NULL,
                                `masa_wlasna_kg` SMALLINT UNSIGNED DEFAULT NULL,
                                `rok_od` SMALLINT UNSIGNED DEFAULT NULL,
                                `rok_do` SMALLINT UNSIGNED DEFAULT NULL,
                                `opis` TEXT DEFAULT NULL,
                                PRIMARY KEY (`id`),
                                UNIQUE KEY `uk_konfiguracja_glowna` (
                                    `generacja_nadwozie_id`,
                                    `silnik_id`,
                                    `naped_id`,
                                    `skrzynia_id`,
                                    `ilosc_biegow`,
                                    `moc_km`
                                    ),
                                KEY `idx_konfiguracja_generacja_nadwozie_id` (`generacja_nadwozie_id`),
                                KEY `idx_konfiguracja_silnik` (`silnik_id`),
                                KEY `idx_konfiguracja_naped_id` (`naped_id`),
                                KEY `idx_konfiguracja_skrzynia_id` (`skrzynia_id`),
                                CONSTRAINT `fk_konfiguracja_generacja_nadwozie`
                                    FOREIGN KEY (`generacja_nadwozie_id`) REFERENCES `generacja_nadwozie` (`id`)
                                        ON DELETE CASCADE
                                        ON UPDATE CASCADE,
                                CONSTRAINT `fk_konfiguracja_silnik`
                                    FOREIGN KEY (`silnik_id`) REFERENCES `silnik` (`id`)
                                        ON DELETE RESTRICT
                                        ON UPDATE CASCADE,
                                CONSTRAINT `fk_konfiguracja_naped`
                                    FOREIGN KEY (`naped_id`) REFERENCES `naped` (`id`)
                                        ON DELETE RESTRICT
                                        ON UPDATE CASCADE,
                                CONSTRAINT `fk_konfiguracja_skrzynia`
                                    FOREIGN KEY (`skrzynia_id`) REFERENCES `skrzynia` (`id`)
                                        ON DELETE RESTRICT
                                        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela pośrednia łącząca konfiguracje z rynkami sprzedaży.
-- Pozwala przypisać jedną konfigurację do jednego lub wielu rynków,
-- np. Europa, USA, Japonia.
-- Rozwiązuje problem wersji dostępnych tylko na określonych rynkach.
CREATE TABLE `konfiguracja_rynek` (
                                      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                      `konfiguracja_id` INT UNSIGNED NOT NULL,
                                      `rynek_id` INT UNSIGNED NOT NULL,
                                      PRIMARY KEY (`id`),
                                      UNIQUE KEY `uk_konfiguracja_rynek` (`konfiguracja_id`, `rynek_id`),
                                      KEY `idx_konfiguracja_rynek_konfiguracja_id` (`konfiguracja_id`),
                                      KEY `idx_konfiguracja_rynek_rynek_id` (`rynek_id`),
                                      CONSTRAINT `fk_konfiguracja_rynek_konfiguracja`
                                          FOREIGN KEY (`konfiguracja_id`) REFERENCES `konfiguracja` (`id`)
                                              ON DELETE CASCADE
                                              ON UPDATE CASCADE,
                                      CONSTRAINT `fk_konfiguracja_rynek_rynek`
                                          FOREIGN KEY (`rynek_id`) REFERENCES `rynek` (`id`)
                                              ON DELETE CASCADE
                                              ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- ZDJĘCIA / MEDIA
-- =========================================================

-- Tabela przechowująca zdjęcia przypisane do całego modelu.
-- Służy do prezentacji ogólnych grafik modelu na stronie.
-- Pole czy_glowne pozwala oznaczyć główne zdjęcie modelu.
CREATE TABLE `zdjecie_modelu` (
                                  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                  `model_id` INT UNSIGNED NOT NULL,
                                  `sciezka` VARCHAR(255) NOT NULL,
                                  `alt` VARCHAR(255) DEFAULT NULL,
                                  `czy_glowne` BOOLEAN NOT NULL DEFAULT 0,
                                  PRIMARY KEY (`id`),
                                  KEY `idx_zdjecie_modelu_model_id` (`model_id`),
                                  CONSTRAINT `fk_zdjecie_modelu_model`
                                      FOREIGN KEY (`model_id`) REFERENCES `model` (`id`)
                                          ON DELETE CASCADE
                                          ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela przechowująca zdjęcia przypisane do konkretnej generacji modelu.
-- Umożliwia pokazanie różnic wizualnych między generacjami.
-- Pole czy_glowne pozwala oznaczyć główne zdjęcie generacji.
CREATE TABLE `zdjecie_generacji` (
                                     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                     `generacja_id` INT UNSIGNED NOT NULL,
                                     `sciezka` VARCHAR(255) NOT NULL,
                                     `alt` VARCHAR(255) DEFAULT NULL,
                                     `czy_glowne` BOOLEAN NOT NULL DEFAULT 0,
                                     PRIMARY KEY (`id`),
                                     KEY `idx_zdjecie_generacji_generacja_id` (`generacja_id`),
                                     CONSTRAINT `fk_zdjecie_generacji_generacja`
                                         FOREIGN KEY (`generacja_id`) REFERENCES `generacja` (`id`)
                                             ON DELETE CASCADE
                                             ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- UŻYTKOWNICY I PORÓWNANIA
-- =========================================================

-- Tabela słownikowa przechowująca statusy kont użytkowników,
-- np. aktywne, nieaktywne, zablokowane, oczekujące na aktywację.
-- Używana w tabeli uzytkownicy_strony.
CREATE TABLE `statusy_kont` (
                                `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                `opis` VARCHAR(50) NOT NULL,
                                PRIMARY KEY (`id`),
                                UNIQUE KEY `uk_statusy_kont_opis` (`opis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela przechowująca konta użytkowników strony.
-- Zawiera podstawowe dane logowania oraz status konta.
-- Użytkownik może tworzyć i zapisywać własne porównania konfiguracji.
CREATE TABLE `uzytkownicy_strony` (
                                      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                      `mail` VARCHAR(320) NOT NULL,
                                      `login` VARCHAR(50) NOT NULL,
                                      `haslo` VARCHAR(255) NOT NULL,
                                      `data_rejestracji` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      `rola` VARCHAR(50) DEFAULT NULL,
                                      `status_konta_id` TINYINT UNSIGNED NOT NULL,
                                      PRIMARY KEY (`id`),
                                      UNIQUE KEY `uk_uzytkownicy_mail` (`mail`),
                                      UNIQUE KEY `uk_uzytkownicy_login` (`login`),
                                      KEY `idx_uzytkownicy_status_konta_id` (`status_konta_id`),
                                      CONSTRAINT `fk_uzytkownicy_status_konta`
                                          FOREIGN KEY (`status_konta_id`) REFERENCES `statusy_kont` (`id`)
                                              ON DELETE RESTRICT
                                              ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela pomocnicza do tymczasowego przechowywania danych rejestracyjnych,
-- np. przed potwierdzeniem maila lub aktywacją konta.
-- Nie jest bezpośrednio powiązana relacją z tabelą użytkowników,
-- ponieważ przechowuje dane jeszcze przed utworzeniem właściwego konta.
CREATE TABLE `tabela_tymczasowa` (
                                     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                     `token` VARCHAR(255) NOT NULL,
                                     `mail` VARCHAR(320) NOT NULL,
                                     `data_zapisania` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     `data_wygasniecia` DATETIME NOT NULL,
                                     `haslo` VARCHAR(255) NOT NULL,
                                     `login` VARCHAR(50) NOT NULL,
                                     `rola` VARCHAR(50) DEFAULT NULL,
                                     PRIMARY KEY (`id`),
                                     UNIQUE KEY `uk_tabela_tymczasowa_token` (`token`),
                                     UNIQUE KEY `uk_tabela_tymczasowa_mail` (`mail`),
                                     UNIQUE KEY `uk_tabela_tymczasowa_login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela przechowująca zapisane porównania użytkownika.
-- Jeden rekord oznacza jedno zapisane porównanie,
-- np. "Japońskie coupe" albo "BMW vs Audi".
CREATE TABLE `porownanie` (
                              `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                              `uzytkownik_id` INT UNSIGNED NOT NULL,
                              `nazwa` VARCHAR(200) NOT NULL,
                              `opis` VARCHAR(500) DEFAULT NULL,
                              `data_utworzenia` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              PRIMARY KEY (`id`),
                              KEY `idx_porownanie_uzytkownik_id` (`uzytkownik_id`),
                              CONSTRAINT `fk_porownanie_uzytkownik`
                                  FOREIGN KEY (`uzytkownik_id`) REFERENCES `uzytkownicy_strony` (`id`)
                                      ON DELETE CASCADE
                                      ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela pośrednia łącząca zapisane porównanie z konkretnymi konfiguracjami.
-- Jeden rekord oznacza jedną konfigurację należącą do danego porównania.
-- Pole kolejnosc określa pozycję samochodu w tabeli porównawczej na stronie.
CREATE TABLE `porownanie_konfiguracje` (
                                           `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                           `porownanie_id` INT UNSIGNED NOT NULL,
                                           `konfiguracja_id` INT UNSIGNED NOT NULL,
                                           `kolejnosc` TINYINT UNSIGNED NOT NULL,
                                           PRIMARY KEY (`id`),
                                           UNIQUE KEY `uk_porownanie_konfiguracja` (`porownanie_id`, `konfiguracja_id`),
                                           UNIQUE KEY `uk_porownanie_kolejnosc` (`porownanie_id`, `kolejnosc`),
                                           KEY `idx_porownanie_konfiguracje_porownanie_id` (`porownanie_id`),
                                           KEY `idx_porownanie_konfiguracje_konfiguracja_id` (`konfiguracja_id`),
                                           CONSTRAINT `fk_porownanie_konfiguracje_porownanie`
                                               FOREIGN KEY (`porownanie_id`) REFERENCES `porownanie` (`id`)
                                                   ON DELETE CASCADE
                                                   ON UPDATE CASCADE,
                                           CONSTRAINT `fk_porownanie_konfiguracje_konfiguracja`
                                               FOREIGN KEY (`konfiguracja_id`) REFERENCES `konfiguracja` (`id`)
                                                   ON DELETE CASCADE
                                                   ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;