INSERT INTO "user" VALUES (1, 'Brynjar', 'brynjar', 'brynjar@brynjar.io', '$2b$12$3M6V.2HpgP12eezvXlWM9u1WMbYgqvCYyBSn.oylHNgOofWqQlh5m', '', true, true, true, false);
INSERT INTO "user" VALUES (2, 'Tjaldvordur', 'tjaldvordur', 'tjaldvordur@hamrar.is', '$2b$12$3M6V.2HpgP12eezvXlWM9u1WMbYgqvCYyBSn.oylHNgOofWqQlh5m', '', false, true, true, false);

INSERT INTO gate VALUES(1, 'Front Entrance', 'gatekeeper', '10.0.0.123', '', '', '', '', 'd4c3b2a1', 'disabled', '', '', null, false);
INSERT INTO gate VALUES(2, 'Side Entrance', 'generic', '', 'http://10.0.0.123/open', 'http://10.0.0.123/close', '', '', 'a1b2c3d4', 'disabled', '', '', null, false);

INSERT INTO alert VALUES(1, 'Test 1', 1, NULL, 1, NULL, NULL, true, '8:00', '16:00', false, true, false);
INSERT INTO alert VALUES(2, 'Test 2', 1, 1, NULL, 'button-1', NULL, false, '', '', false, true, false);

INSERT INTO log VALUES(1, '2021-05-05 20:00:05', 1, 2, 'keypad', 1, '1234', 'open', '', '', '', true, false);
INSERT INTO log VALUES(2, '2021-05-05 20:00:05', 2, 1, 'plate', 1, 'RA232', 'open', '', '', '', false, false);