/* INSERTY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

START TRANSACTION;

-- =========================
-- SŁOWNIKI
-- =========================

INSERT INTO kraj (nazwa)
VALUES ('Korea Południowa'), ('Japonia')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO typ_nadwozia (nazwa)
VALUES ('Coupe'), ('Roadster')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO naped (nazwa)
VALUES ('RWD')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO skrzynia (nazwa)
VALUES ('manual'), ('automat')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO typ_paliwa (nazwa)
VALUES ('benzyna')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO architektura_silnika (nazwa)
VALUES ('tłokowy')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO doladowanie (nazwa)
VALUES ('turbo'), ('wolnossący')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO uklad_cylindrow (nazwa)
VALUES ('R'), ('V'), ('bokser')
    ON DUPLICATE KEY UPDATE nazwa = VALUES(nazwa);

INSERT INTO rynek (nazwa, kod, opis)
VALUES ('Global', 'GLB', 'Wersja ogólna / brak rozbicia na konkretny rynek')
    ON DUPLICATE KEY UPDATE
                         nazwa = VALUES(nazwa),
                         opis = VALUES(opis);

-- =========================
-- MARKI
-- =========================

INSERT INTO marka (nazwa, kraj_id, opis)
SELECT
    'Hyundai',
    k.id,
    'Południowokoreański producent samochodów.'
FROM kraj k
WHERE k.nazwa = 'Korea Południowa'
    ON DUPLICATE KEY UPDATE
                         kraj_id = VALUES(kraj_id),
                         opis = VALUES(opis);

INSERT INTO marka (nazwa, kraj_id, opis)
SELECT
    'Toyota',
    k.id,
    'Japoński producent samochodów.'
FROM kraj k
WHERE k.nazwa = 'Japonia'
    ON DUPLICATE KEY UPDATE
                         kraj_id = VALUES(kraj_id),
                         opis = VALUES(opis);

INSERT INTO marka (nazwa, kraj_id, opis)
SELECT
    'Nissan',
    k.id,
    'Japoński producent samochodów.'
FROM kraj k
WHERE k.nazwa = 'Japonia'
    ON DUPLICATE KEY UPDATE
                         kraj_id = VALUES(kraj_id),
                         opis = VALUES(opis);

-- =========================
-- MODELE
-- =========================

INSERT INTO model (marka_id, nazwa, slug, segment, opis, rok_debiutu, rok_zakonczenia)
SELECT
    m.id,
    'Genesis coupe',
    'genesis-coupe',
    'sport coupe',
    'Dwudrzwiowe sportowe coupe z napędem na tył.',
    2008,
    2016
FROM marka m
WHERE m.nazwa = 'Hyundai'
    ON DUPLICATE KEY UPDATE
                         slug = VALUES(slug),
                         segment = VALUES(segment),
                         opis = VALUES(opis),
                         rok_debiutu = VALUES(rok_debiutu),
                         rok_zakonczenia = VALUES(rok_zakonczenia);

INSERT INTO model (marka_id, nazwa, slug, segment, opis, rok_debiutu, rok_zakonczenia)
SELECT
    m.id,
    '86',
    'toyota-86',
    'sport coupe',
    'Dwudrzwiowe sportowe coupe z napędem na tył.',
    2012,
    NULL
FROM marka m
WHERE m.nazwa = 'Toyota'
    ON DUPLICATE KEY UPDATE
                         slug = VALUES(slug),
                         segment = VALUES(segment),
                         opis = VALUES(opis),
                         rok_debiutu = VALUES(rok_debiutu),
                         rok_zakonczenia = VALUES(rok_zakonczenia);

INSERT INTO model (marka_id, nazwa, slug, segment, opis, rok_debiutu, rok_zakonczenia)
SELECT
    m.id,
    '370Z',
    'nissan-370z',
    'sport coupe',
    'Dwudrzwiowy sportowy samochód z napędem na tył.',
    2009,
    2020
FROM marka m
WHERE m.nazwa = 'Nissan'
    ON DUPLICATE KEY UPDATE
                         slug = VALUES(slug),
                         segment = VALUES(segment),
                         opis = VALUES(opis),
                         rok_debiutu = VALUES(rok_debiutu),
                         rok_zakonczenia = VALUES(rok_zakonczenia);

-- =========================
-- GENERACJE
-- =========================

INSERT INTO generacja (model_id, nazwa, kod, rok_od, rok_do, opis)
SELECT
    mo.id,
    'BK1',
    'BK1',
    2008,
    2012,
    'Pierwsza wersja Hyundai Genesis Coupe.'
FROM model mo
         JOIN marka ma ON ma.id = mo.marka_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe'
    ON DUPLICATE KEY UPDATE
                         kod = VALUES(kod),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja (model_id, nazwa, kod, rok_od, rok_do, opis)
SELECT
    mo.id,
    'BK2',
    'BK2',
    2013,
    2016,
    'Zmodernizowana wersja Hyundai Genesis Coupe.'
FROM model mo
         JOIN marka ma ON ma.id = mo.marka_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe'
    ON DUPLICATE KEY UPDATE
                         kod = VALUES(kod),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja (model_id, nazwa, kod, rok_od, rok_do, opis)
SELECT
    mo.id,
    'ZN6',
    'ZN6',
    2012,
    2021,
    'Pierwsza generacja Toyota 86.'
FROM model mo
         JOIN marka ma ON ma.id = mo.marka_id
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86'
    ON DUPLICATE KEY UPDATE
                         kod = VALUES(kod),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja (model_id, nazwa, kod, rok_od, rok_do, opis)
SELECT
    mo.id,
    'ZN8',
    'ZN8',
    2021,
    NULL,
    'Druga generacja modelu Toyota 86, sprzedawana jako Toyota GR 86.'
FROM model mo
         JOIN marka ma ON ma.id = mo.marka_id
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86'
    ON DUPLICATE KEY UPDATE
                         kod = VALUES(kod),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja (model_id, nazwa, kod, rok_od, rok_do, opis)
SELECT
    mo.id,
    'Z34',
    'Z34',
    2009,
    2020,
    'Jedyna generacja Nissan 370Z.'
FROM model mo
         JOIN marka ma ON ma.id = mo.marka_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z'
    ON DUPLICATE KEY UPDATE
                         kod = VALUES(kod),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

-- =========================
-- GENERACJA + NADWOZIE
-- =========================

INSERT INTO generacja_nadwozie (generacja_id, typ_nadwozia_id, liczba_drzwi, rok_od, rok_do, opis)
SELECT
    g.id,
    tn.id,
    2,
    g.rok_od,
    g.rok_do,
    'Coupe 2-drzwiowe'
FROM generacja g
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN typ_nadwozia tn ON tn.nazwa = 'Coupe'
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK1'
    ON DUPLICATE KEY UPDATE
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja_nadwozie (generacja_id, typ_nadwozia_id, liczba_drzwi, rok_od, rok_do, opis)
SELECT
    g.id,
    tn.id,
    2,
    g.rok_od,
    g.rok_do,
    'Coupe 2-drzwiowe'
FROM generacja g
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN typ_nadwozia tn ON tn.nazwa = 'Coupe'
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK2'
    ON DUPLICATE KEY UPDATE
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja_nadwozie (generacja_id, typ_nadwozia_id, liczba_drzwi, rok_od, rok_do, opis)
SELECT
    g.id,
    tn.id,
    2,
    g.rok_od,
    g.rok_do,
    'Coupe 2-drzwiowe'
FROM generacja g
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN typ_nadwozia tn ON tn.nazwa = 'Coupe'
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86' AND g.nazwa = 'ZN6'
    ON DUPLICATE KEY UPDATE
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja_nadwozie (generacja_id, typ_nadwozia_id, liczba_drzwi, rok_od, rok_do, opis)
SELECT
    g.id,
    tn.id,
    2,
    g.rok_od,
    g.rok_do,
    'Coupe 2-drzwiowe'
FROM generacja g
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN typ_nadwozia tn ON tn.nazwa = 'Coupe'
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86' AND g.nazwa = 'ZN8'
    ON DUPLICATE KEY UPDATE
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja_nadwozie (generacja_id, typ_nadwozia_id, liczba_drzwi, rok_od, rok_do, opis)
SELECT
    g.id,
    tn.id,
    2,
    2009,
    2020,
    'Coupe 2-drzwiowe'
FROM generacja g
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN typ_nadwozia tn ON tn.nazwa = 'Coupe'
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34'
    ON DUPLICATE KEY UPDATE
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO generacja_nadwozie (generacja_id, typ_nadwozia_id, liczba_drzwi, rok_od, rok_do, opis)
SELECT
    g.id,
    tn.id,
    2,
    2009,
    2019,
    'Roadster 2-drzwiowy'
FROM generacja g
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN typ_nadwozia tn ON tn.nazwa = 'Roadster'
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34'
    ON DUPLICATE KEY UPDATE
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

-- =========================
-- SILNIKI
-- =========================

INSERT INTO silnik (
    marka_id, kod, nazwa_handlowa, architektura_silnika_id, typ_paliwa_id,
    doladowanie_id, uklad_cylindrow_id, pojemnosc_cm3, liczba_cylindrow,
    moc_min_km, moc_max_km, opis
)
SELECT
    ma.id,
    'Theta II 2.0T',
    '2.0T Theta II',
    a.id, p.id, d.id, u.id,
    1998,
    4,
    210,
    275,
    'Benzynowy, turbodoładowany silnik R4 stosowany w Hyundai Genesis Coupe BK1 i BK2.'
FROM marka ma
         JOIN architektura_silnika a ON a.nazwa = 'tłokowy'
         JOIN typ_paliwa p ON p.nazwa = 'benzyna'
         JOIN doladowanie d ON d.nazwa = 'turbo'
         JOIN uklad_cylindrow u ON u.nazwa = 'R'
WHERE ma.nazwa = 'Hyundai'
    ON DUPLICATE KEY UPDATE
                         nazwa_handlowa = VALUES(nazwa_handlowa),
                         architektura_silnika_id = VALUES(architektura_silnika_id),
                         typ_paliwa_id = VALUES(typ_paliwa_id),
                         doladowanie_id = VALUES(doladowanie_id),
                         uklad_cylindrow_id = VALUES(uklad_cylindrow_id),
                         pojemnosc_cm3 = VALUES(pojemnosc_cm3),
                         liczba_cylindrow = VALUES(liczba_cylindrow),
                         moc_min_km = VALUES(moc_min_km),
                         moc_max_km = VALUES(moc_max_km),
                         opis = VALUES(opis);

INSERT INTO silnik (
    marka_id, kod, nazwa_handlowa, architektura_silnika_id, typ_paliwa_id,
    doladowanie_id, uklad_cylindrow_id, pojemnosc_cm3, liczba_cylindrow,
    moc_min_km, moc_max_km, opis
)
SELECT
    ma.id,
    'Lambda II 3.8 V6',
    '3.8 V6 Lambda II',
    a.id, p.id, d.id, u.id,
    3778,
    6,
    303,
    303,
    'Benzynowy, wolnossący silnik V6 stosowany w Hyundai Genesis Coupe BK1.'
FROM marka ma
         JOIN architektura_silnika a ON a.nazwa = 'tłokowy'
         JOIN typ_paliwa p ON p.nazwa = 'benzyna'
         JOIN doladowanie d ON d.nazwa = 'wolnossący'
         JOIN uklad_cylindrow u ON u.nazwa = 'V'
WHERE ma.nazwa = 'Hyundai'
    ON DUPLICATE KEY UPDATE
                         nazwa_handlowa = VALUES(nazwa_handlowa),
                         architektura_silnika_id = VALUES(architektura_silnika_id),
                         typ_paliwa_id = VALUES(typ_paliwa_id),
                         doladowanie_id = VALUES(doladowanie_id),
                         uklad_cylindrow_id = VALUES(uklad_cylindrow_id),
                         pojemnosc_cm3 = VALUES(pojemnosc_cm3),
                         liczba_cylindrow = VALUES(liczba_cylindrow),
                         moc_min_km = VALUES(moc_min_km),
                         moc_max_km = VALUES(moc_max_km),
                         opis = VALUES(opis);

INSERT INTO silnik (
    marka_id, kod, nazwa_handlowa, architektura_silnika_id, typ_paliwa_id,
    doladowanie_id, uklad_cylindrow_id, pojemnosc_cm3, liczba_cylindrow,
    moc_min_km, moc_max_km, opis
)
SELECT
    ma.id,
    'Lambda II 3.8 V6 GDI',
    '3.8 V6 Lambda II GDI',
    a.id, p.id, d.id, u.id,
    3778,
    6,
    348,
    348,
    'Benzynowy, wolnossący silnik V6 GDI stosowany w Hyundai Genesis Coupe BK2.'
FROM marka ma
         JOIN architektura_silnika a ON a.nazwa = 'tłokowy'
         JOIN typ_paliwa p ON p.nazwa = 'benzyna'
         JOIN doladowanie d ON d.nazwa = 'wolnossący'
         JOIN uklad_cylindrow u ON u.nazwa = 'V'
WHERE ma.nazwa = 'Hyundai'
    ON DUPLICATE KEY UPDATE
                         nazwa_handlowa = VALUES(nazwa_handlowa),
                         architektura_silnika_id = VALUES(architektura_silnika_id),
                         typ_paliwa_id = VALUES(typ_paliwa_id),
                         doladowanie_id = VALUES(doladowanie_id),
                         uklad_cylindrow_id = VALUES(uklad_cylindrow_id),
                         pojemnosc_cm3 = VALUES(pojemnosc_cm3),
                         liczba_cylindrow = VALUES(liczba_cylindrow),
                         moc_min_km = VALUES(moc_min_km),
                         moc_max_km = VALUES(moc_max_km),
                         opis = VALUES(opis);

INSERT INTO silnik (
    marka_id, kod, nazwa_handlowa, architektura_silnika_id, typ_paliwa_id,
    doladowanie_id, uklad_cylindrow_id, pojemnosc_cm3, liczba_cylindrow,
    moc_min_km, moc_max_km, opis
)
SELECT
    ma.id,
    'FA20',
    '2.0 Boxer FA20',
    a.id, p.id, d.id, u.id,
    1998,
    4,
    200,
    200,
    'Benzynowy, wolnossący silnik bokser B4 stosowany w Toyota 86 ZN6.'
FROM marka ma
         JOIN architektura_silnika a ON a.nazwa = 'tłokowy'
         JOIN typ_paliwa p ON p.nazwa = 'benzyna'
         JOIN doladowanie d ON d.nazwa = 'wolnossący'
         JOIN uklad_cylindrow u ON u.nazwa = 'bokser'
WHERE ma.nazwa = 'Toyota'
    ON DUPLICATE KEY UPDATE
                         nazwa_handlowa = VALUES(nazwa_handlowa),
                         architektura_silnika_id = VALUES(architektura_silnika_id),
                         typ_paliwa_id = VALUES(typ_paliwa_id),
                         doladowanie_id = VALUES(doladowanie_id),
                         uklad_cylindrow_id = VALUES(uklad_cylindrow_id),
                         pojemnosc_cm3 = VALUES(pojemnosc_cm3),
                         liczba_cylindrow = VALUES(liczba_cylindrow),
                         moc_min_km = VALUES(moc_min_km),
                         moc_max_km = VALUES(moc_max_km),
                         opis = VALUES(opis);

INSERT INTO silnik (
    marka_id, kod, nazwa_handlowa, architektura_silnika_id, typ_paliwa_id,
    doladowanie_id, uklad_cylindrow_id, pojemnosc_cm3, liczba_cylindrow,
    moc_min_km, moc_max_km, opis
)
SELECT
    ma.id,
    'FA24D',
    '2.4 Boxer FA24D',
    a.id, p.id, d.id, u.id,
    2398,
    4,
    228,
    228,
    'Benzynowy, wolnossący silnik bokser B4 stosowany w Toyota GR 86 ZN8.'
FROM marka ma
         JOIN architektura_silnika a ON a.nazwa = 'tłokowy'
         JOIN typ_paliwa p ON p.nazwa = 'benzyna'
         JOIN doladowanie d ON d.nazwa = 'wolnossący'
         JOIN uklad_cylindrow u ON u.nazwa = 'bokser'
WHERE ma.nazwa = 'Toyota'
    ON DUPLICATE KEY UPDATE
                         nazwa_handlowa = VALUES(nazwa_handlowa),
                         architektura_silnika_id = VALUES(architektura_silnika_id),
                         typ_paliwa_id = VALUES(typ_paliwa_id),
                         doladowanie_id = VALUES(doladowanie_id),
                         uklad_cylindrow_id = VALUES(uklad_cylindrow_id),
                         pojemnosc_cm3 = VALUES(pojemnosc_cm3),
                         liczba_cylindrow = VALUES(liczba_cylindrow),
                         moc_min_km = VALUES(moc_min_km),
                         moc_max_km = VALUES(moc_max_km),
                         opis = VALUES(opis);

INSERT INTO silnik (
    marka_id, kod, nazwa_handlowa, architektura_silnika_id, typ_paliwa_id,
    doladowanie_id, uklad_cylindrow_id, pojemnosc_cm3, liczba_cylindrow,
    moc_min_km, moc_max_km, opis
)
SELECT
    ma.id,
    'VQ37VHR',
    '3.7 V6 VQ37VHR',
    a.id, p.id, d.id, u.id,
    3696,
    6,
    328,
    328,
    'Benzynowy, wolnossący silnik V6 stosowany w Nissan 370Z.'
FROM marka ma
         JOIN architektura_silnika a ON a.nazwa = 'tłokowy'
         JOIN typ_paliwa p ON p.nazwa = 'benzyna'
         JOIN doladowanie d ON d.nazwa = 'wolnossący'
         JOIN uklad_cylindrow u ON u.nazwa = 'V'
WHERE ma.nazwa = 'Nissan'
    ON DUPLICATE KEY UPDATE
                         nazwa_handlowa = VALUES(nazwa_handlowa),
                         architektura_silnika_id = VALUES(architektura_silnika_id),
                         typ_paliwa_id = VALUES(typ_paliwa_id),
                         doladowanie_id = VALUES(doladowanie_id),
                         uklad_cylindrow_id = VALUES(uklad_cylindrow_id),
                         pojemnosc_cm3 = VALUES(pojemnosc_cm3),
                         liczba_cylindrow = VALUES(liczba_cylindrow),
                         moc_min_km = VALUES(moc_min_km),
                         moc_max_km = VALUES(moc_max_km),
                         opis = VALUES(opis);

INSERT INTO silnik (
    marka_id, kod, nazwa_handlowa, architektura_silnika_id, typ_paliwa_id,
    doladowanie_id, uklad_cylindrow_id, pojemnosc_cm3, liczba_cylindrow,
    moc_min_km, moc_max_km, opis
)
SELECT
    ma.id,
    'VQ37VHR Nismo',
    '3.7 V6 VQ37VHR Nismo',
    a.id, p.id, d.id, u.id,
    3696,
    6,
    344,
    344,
    'Benzynowy, wolnossący silnik V6 w wersji Nismo stosowany w Nissan 370Z.'
FROM marka ma
         JOIN architektura_silnika a ON a.nazwa = 'tłokowy'
         JOIN typ_paliwa p ON p.nazwa = 'benzyna'
         JOIN doladowanie d ON d.nazwa = 'wolnossący'
         JOIN uklad_cylindrow u ON u.nazwa = 'V'
WHERE ma.nazwa = 'Nissan'
    ON DUPLICATE KEY UPDATE
                         nazwa_handlowa = VALUES(nazwa_handlowa),
                         architektura_silnika_id = VALUES(architektura_silnika_id),
                         typ_paliwa_id = VALUES(typ_paliwa_id),
                         doladowanie_id = VALUES(doladowanie_id),
                         uklad_cylindrow_id = VALUES(uklad_cylindrow_id),
                         pojemnosc_cm3 = VALUES(pojemnosc_cm3),
                         liczba_cylindrow = VALUES(liczba_cylindrow),
                         moc_min_km = VALUES(moc_min_km),
                         moc_max_km = VALUES(moc_max_km),
                         opis = VALUES(opis);

-- =========================
-- KONFIGURACJE HYUNDAI BK1
-- =========================

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '2.0T manual', 6, 210, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2008, 2012,
    'Hyundai Genesis Coupe BK1 2.0T manual RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Theta II 2.0T'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK1' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '2.0T automat', 5, 210, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2008, 2012,
    'Hyundai Genesis Coupe BK1 2.0T automat RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Theta II 2.0T'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK1' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '3.8 V6 manual', 6, 303, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2008, 2012,
    'Hyundai Genesis Coupe BK1 3.8 V6 manual RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Lambda II 3.8 V6'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK1' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '3.8 V6 automat', 6, 303, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2008, 2012,
    'Hyundai Genesis Coupe BK1 3.8 V6 automat RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Lambda II 3.8 V6'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK1' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

-- =========================
-- KONFIGURACJE HYUNDAI BK2
-- =========================

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '2.0T manual', 6, 275, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2013, 2016,
    'Hyundai Genesis Coupe BK2 2.0T manual RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Theta II 2.0T'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK2' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '2.0T automat', 8, 275, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2013, 2016,
    'Hyundai Genesis Coupe BK2 2.0T automat RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Theta II 2.0T'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK2' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '3.8 V6 GDI manual', 6, 348, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2013, 2016,
    'Hyundai Genesis Coupe BK2 3.8 V6 GDI manual RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Lambda II 3.8 V6 GDI'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK2' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    '3.8 V6 GDI automat', 8, 348, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2013, 2016,
    'Hyundai Genesis Coupe BK2 3.8 V6 GDI automat RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'Lambda II 3.8 V6 GDI'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa = 'BK2' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

-- =========================
-- KONFIGURACJE TOYOTA ZN6
-- =========================

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'FA20 manual', 6, 200, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2012, 2021,
    'Toyota 86 ZN6 FA20 manual RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'FA20'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86' AND g.nazwa = 'ZN6' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'FA20 automat', 6, 200, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2012, 2021,
    'Toyota 86 ZN6 FA20 automat RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'FA20'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86' AND g.nazwa = 'ZN6' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

-- =========================
-- KONFIGURACJE TOYOTA ZN8
-- =========================

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'FA24D manual', 6, 228, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2021, NULL,
    'Toyota 86 ZN8 (GR 86) FA24D manual RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'FA24D'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86' AND g.nazwa = 'ZN8' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'FA24D automat', 6, 228, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2021, NULL,
    'Toyota 86 ZN8 (GR 86) FA24D automat RWD'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'FA24D'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Toyota' AND mo.nazwa = '86' AND g.nazwa = 'ZN8' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

-- =========================
-- KONFIGURACJE NISSAN 370Z Z34
-- =========================

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'VQ37VHR manual', 6, 328, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2009, 2020,
    'Nissan 370Z Z34 VQ37VHR manual RWD coupe'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'VQ37VHR'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'VQ37VHR automat', 7, 328, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2009, 2020,
    'Nissan 370Z Z34 VQ37VHR automat RWD coupe'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'VQ37VHR'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'VQ37VHR manual', 6, 328, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2009, 2019,
    'Nissan 370Z Z34 VQ37VHR manual RWD roadster'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'VQ37VHR'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34' AND tn.nazwa = 'Roadster'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'VQ37VHR automat', 7, 328, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2009, 2019,
    'Nissan 370Z Z34 VQ37VHR automat RWD roadster'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'VQ37VHR'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34' AND tn.nazwa = 'Roadster'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'VQ37VHR Nismo manual', 6, 344, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2009, 2014,
    'Nissan 370Z Z34 VQ37VHR Nismo manual RWD coupe'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'VQ37VHR Nismo'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'VQ37VHR Nismo manual', 6, 344, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2015, 2020,
    'Nissan 370Z Z34 VQ37VHR Nismo manual RWD coupe'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'VQ37VHR Nismo'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'manual'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

INSERT INTO konfiguracja (
    generacja_nadwozie_id, silnik_id, naped_id, skrzynia_id,
    nazwa_wersji, ilosc_biegow, moc_km, moment_nm,
    przyspieszenie_0_100, predkosc_max, spalanie_srednie,
    spalanie_miasto, spalanie_trasa, masa_wlasna_kg,
    rok_od, rok_do, opis
)
SELECT
    gn.id, s.id, n.id, sk.id,
    'VQ37VHR Nismo automat', 7, 344, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL,
    2015, 2020,
    'Nissan 370Z Z34 VQ37VHR Nismo automat RWD coupe'
FROM generacja_nadwozie gn
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN silnik s ON s.kod = 'VQ37VHR Nismo'
         JOIN naped n ON n.nazwa = 'RWD'
         JOIN skrzynia sk ON sk.nazwa = 'automat'
         JOIN typ_nadwozia tn ON tn.id = gn.typ_nadwozia_id
WHERE ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34' AND tn.nazwa = 'Coupe'
    ON DUPLICATE KEY UPDATE
                         nazwa_wersji = VALUES(nazwa_wersji),
                         moment_nm = VALUES(moment_nm),
                         rok_od = VALUES(rok_od),
                         rok_do = VALUES(rok_do),
                         opis = VALUES(opis);

-- =========================
-- PRZYPISANIE RYNKU GLOBAL
-- =========================

INSERT INTO konfiguracja_rynek (konfiguracja_id, rynek_id)
SELECT
    k.id,
    r.id
FROM konfiguracja k
         JOIN generacja_nadwozie gn ON gn.id = k.generacja_nadwozie_id
         JOIN generacja g ON g.id = gn.generacja_id
         JOIN model mo ON mo.id = g.model_id
         JOIN marka ma ON ma.id = mo.marka_id
         JOIN rynek r ON r.kod = 'GLB'
WHERE
    (ma.nazwa = 'Hyundai' AND mo.nazwa = 'Genesis coupe' AND g.nazwa IN ('BK1', 'BK2'))
   OR
    (ma.nazwa = 'Toyota' AND mo.nazwa = '86' AND g.nazwa IN ('ZN6', 'ZN8'))
   OR
    (ma.nazwa = 'Nissan' AND mo.nazwa = '370Z' AND g.nazwa = 'Z34')
    ON DUPLICATE KEY UPDATE konfiguracja_id = VALUES(konfiguracja_id);

COMMIT;