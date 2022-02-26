EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A3 16535 11693
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L Connector:Screw_Terminal_01x03 J1
U 1 1 5F0606DD
P 15300 1500
F 0 "J1" H 15380 1542 50  0000 L CNN
F 1 "RELAY1" H 15380 1451 50  0000 L CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-3-5.08_1x03_P5.08mm_Horizontal" H 15300 1500 50  0001 C CNN
F 3 "~" H 15300 1500 50  0001 C CNN
	1    15300 1500
	1    0    0    -1  
$EndComp
Wire Wire Line
	15100 1500 14700 1500
Wire Wire Line
	14700 1500 14700 1900
Wire Wire Line
	14700 1900 14000 1900
Wire Wire Line
	14000 1900 14000 1800
Wire Wire Line
	15100 1400 14700 1400
Wire Wire Line
	14700 1400 14700 1100
$Comp
L power:+5V #PWR02
U 1 1 5F068BF8
P 13050 1000
F 0 "#PWR02" H 13050 850 50  0001 C CNN
F 1 "+5V" H 13065 1173 50  0000 C CNN
F 2 "" H 13050 1000 50  0001 C CNN
F 3 "" H 13050 1000 50  0001 C CNN
	1    13050 1000
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 1300 13050 1100
Wire Wire Line
	13700 1200 13700 1100
Wire Wire Line
	13700 1100 13050 1100
Connection ~ 13050 1100
Wire Wire Line
	13050 1100 13050 1000
Wire Wire Line
	15100 1600 15000 1600
Wire Wire Line
	15000 1600 15000 1850
Wire Wire Line
	15000 1850 15700 1850
Wire Wire Line
	15700 1850 15700 950 
Connection ~ 13050 1900
Wire Wire Line
	13050 2100 13050 1900
Wire Wire Line
	13050 2500 13050 2700
$Comp
L power:GND #PWR03
U 1 1 5F06D1CF
P 13050 2700
F 0 "#PWR03" H 13050 2450 50  0001 C CNN
F 1 "GND" H 13055 2527 50  0000 C CNN
F 2 "" H 13050 2700 50  0001 C CNN
F 3 "" H 13050 2700 50  0001 C CNN
	1    13050 2700
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 1900 13050 1700
Wire Wire Line
	13700 1900 13050 1900
Wire Wire Line
	13700 1800 13700 1900
$Comp
L Device:LED D1
U 1 1 5F09201B
P 12100 1500
F 0 "D1" V 12054 1628 50  0000 L CNN
F 1 "RELAY1" V 12145 1628 50  0000 L CNN
F 2 "Diode_THT:D_A-405_P2.54mm_Vertical_AnodeUp" H 12100 1500 50  0001 C CNN
F 3 "~" H 12100 1500 50  0001 C CNN
	1    12100 1500
	0    -1   -1   0   
$EndComp
Wire Wire Line
	7100 4450 7950 4450
$Comp
L Device:R R12
U 1 1 5F121C02
P 8250 1750
F 0 "R12" V 8043 1750 50  0000 C CNN
F 1 "1k" V 8134 1750 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 8180 1750 50  0001 C CNN
F 3 "~" H 8250 1750 50  0001 C CNN
	1    8250 1750
	-1   0    0    1   
$EndComp
Wire Wire Line
	7100 4050 8000 4050
$Comp
L Connector_Generic:Conn_01x02 J8
U 1 1 5F1DAA9D
P 8950 4250
F 0 "J8" H 9030 4242 50  0000 L CNN
F 1 "Serial" H 9030 4151 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 8950 4250 50  0001 C CNN
F 3 "~" H 8950 4250 50  0001 C CNN
	1    8950 4250
	1    0    0    -1  
$EndComp
$Comp
L Switch:SW_Push SW1
U 1 1 5F1E74F9
P 8750 2000
F 0 "SW1" H 8750 2285 50  0000 C CNN
F 1 "Reset" H 8750 2194 50  0000 C CNN
F 2 "Button_Switch_SMD:SW_Push_1P1T_NO_CK_KMR2" H 8750 2200 50  0001 C CNN
F 3 "~" H 8750 2200 50  0001 C CNN
	1    8750 2000
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR040
U 1 1 5F1F2747
P 9300 2100
F 0 "#PWR040" H 9300 1850 50  0001 C CNN
F 1 "GND" H 9305 1927 50  0000 C CNN
F 2 "" H 9300 2100 50  0001 C CNN
F 3 "" H 9300 2100 50  0001 C CNN
	1    9300 2100
	1    0    0    -1  
$EndComp
Wire Wire Line
	6600 2250 6600 2050
Wire Wire Line
	6600 2050 6500 2050
Wire Wire Line
	6500 2250 6500 2050
Connection ~ 6500 2050
$Comp
L power:+5V #PWR023
U 1 1 5F240F7D
P 4650 1950
F 0 "#PWR023" H 4650 1800 50  0001 C CNN
F 1 "+5V" V 4665 2078 50  0000 L CNN
F 2 "" H 4650 1950 50  0001 C CNN
F 3 "" H 4650 1950 50  0001 C CNN
	1    4650 1950
	1    0    0    -1  
$EndComp
Wire Wire Line
	6500 5250 6500 5500
$Comp
L power:GND #PWR032
U 1 1 5F24702A
P 6500 5500
F 0 "#PWR032" H 6500 5250 50  0001 C CNN
F 1 "GND" H 6505 5327 50  0000 C CNN
F 2 "" H 6500 5500 50  0001 C CNN
F 3 "" H 6500 5500 50  0001 C CNN
	1    6500 5500
	1    0    0    -1  
$EndComp
Wire Wire Line
	8550 2000 8250 2000
Wire Wire Line
	8950 2000 9300 2000
Wire Wire Line
	7100 3150 8800 3150
Wire Wire Line
	8800 3150 8800 3050
$Comp
L Device:Crystal Y2
U 1 1 5F28ACEF
P 9300 3200
F 0 "Y2" V 9254 3331 50  0000 L CNN
F 1 "16MHz" V 9345 3331 50  0000 L CNN
F 2 "Crystal:Crystal_SMD_HC49-SD_HandSoldering" H 9300 3200 50  0001 C CNN
F 3 "~" H 9300 3200 50  0001 C CNN
	1    9300 3200
	0    1    1    0   
$EndComp
Wire Wire Line
	8800 3350 8800 3250
Wire Wire Line
	8800 3250 7100 3250
$Comp
L Device:C C6
U 1 1 5F2CA111
P 9300 2900
F 0 "C6" H 9415 2946 50  0000 L CNN
F 1 "22pF" H 9415 2855 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 9338 2750 50  0001 C CNN
F 3 "~" H 9300 2900 50  0001 C CNN
	1    9300 2900
	1    0    0    -1  
$EndComp
Connection ~ 9300 3050
$Comp
L Device:C C7
U 1 1 5F2CB080
P 9300 3500
F 0 "C7" H 9415 3546 50  0000 L CNN
F 1 "22pF" H 9415 3455 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 9338 3350 50  0001 C CNN
F 3 "~" H 9300 3500 50  0001 C CNN
	1    9300 3500
	1    0    0    -1  
$EndComp
Connection ~ 9300 3350
Wire Wire Line
	8800 3050 9300 3050
Wire Wire Line
	8800 3350 9300 3350
$Comp
L Device:R R18
U 1 1 5F3196FB
P 12350 2300
F 0 "R18" V 12143 2300 50  0000 C CNN
F 1 "1k" V 12234 2300 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12280 2300 50  0001 C CNN
F 3 "~" H 12350 2300 50  0001 C CNN
	1    12350 2300
	0    1    1    0   
$EndComp
$Comp
L Converter_ACDC:IRM-10-12 PS1
U 1 1 5F369040
P 2050 2500
F 0 "PS1" H 2050 2867 50  0000 C CNN
F 1 "IRM-10-12" H 2050 2776 50  0000 C CNN
F 2 "Converter_ACDC:Converter_ACDC_MeanWell_IRM-10-xx_THT" H 2050 2150 50  0001 C CNN
F 3 "https://www.meanwell.com/Upload/PDF/IRM-10/IRM-10-SPEC.PDF" H 2050 2100 50  0001 C CNN
	1    2050 2500
	1    0    0    -1  
$EndComp
$Comp
L Connector:Screw_Terminal_01x02 J2
U 1 1 5F369E96
P 1150 1750
F 0 "J2" V 1114 1562 50  0000 R CNN
F 1 "230VAC IN" V 1023 1562 50  0000 R CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-2-5.08_1x02_P5.08mm_Horizontal" H 1150 1750 50  0001 C CNN
F 3 "~" H 1150 1750 50  0001 C CNN
	1    1150 1750
	0    -1   -1   0   
$EndComp
$Comp
L Connector:Screw_Terminal_01x02 J3
U 1 1 5F36AA22
P 2800 1750
F 0 "J3" V 2764 1562 50  0000 R CNN
F 1 "12VDC OUT" V 2673 1562 50  0000 R CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-2-5.08_1x02_P5.08mm_Horizontal" H 2800 1750 50  0001 C CNN
F 3 "~" H 2800 1750 50  0001 C CNN
	1    2800 1750
	0    -1   -1   0   
$EndComp
Wire Wire Line
	2450 2400 2800 2400
Wire Wire Line
	2800 2400 2800 1950
Wire Wire Line
	2450 2600 2900 2600
Wire Wire Line
	2900 2600 2900 1950
Connection ~ 2800 2400
Connection ~ 2900 2600
$Comp
L power:GND #PWR013
U 1 1 5F3AE0E4
P 3500 2700
F 0 "#PWR013" H 3500 2450 50  0001 C CNN
F 1 "GND" V 3505 2572 50  0000 R CNN
F 2 "" H 3500 2700 50  0001 C CNN
F 3 "" H 3500 2700 50  0001 C CNN
	1    3500 2700
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR012
U 1 1 5F3AE848
P 3500 2300
F 0 "#PWR012" H 3500 2150 50  0001 C CNN
F 1 "+12V" V 3515 2428 50  0000 L CNN
F 2 "" H 3500 2300 50  0001 C CNN
F 3 "" H 3500 2300 50  0001 C CNN
	1    3500 2300
	1    0    0    -1  
$EndComp
$Comp
L Device:LED D3
U 1 1 5F3AFA11
P 2800 3350
F 0 "D3" V 2839 3232 50  0000 R CNN
F 1 "12V" V 2748 3232 50  0000 R CNN
F 2 "Diode_THT:D_A-405_P2.54mm_Vertical_AnodeUp" H 2800 3350 50  0001 C CNN
F 3 "~" H 2800 3350 50  0001 C CNN
	1    2800 3350
	0    -1   -1   0   
$EndComp
Wire Wire Line
	2800 2750 2800 2400
Wire Wire Line
	2800 3500 2800 3600
$Comp
L power:GND #PWR09
U 1 1 5F3C8148
P 2800 3600
F 0 "#PWR09" H 2800 3350 50  0001 C CNN
F 1 "GND" H 2805 3427 50  0000 C CNN
F 2 "" H 2800 3600 50  0001 C CNN
F 3 "" H 2800 3600 50  0001 C CNN
	1    2800 3600
	1    0    0    -1  
$EndComp
$Comp
L Device:R R6
U 1 1 5F3D61EF
P 2800 2900
F 0 "R6" H 2870 2946 50  0000 L CNN
F 1 "560" H 2870 2855 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 2730 2900 50  0001 C CNN
F 3 "~" H 2800 2900 50  0001 C CNN
	1    2800 2900
	1    0    0    -1  
$EndComp
Wire Wire Line
	2800 3050 2800 3200
$Comp
L Connector:Screw_Terminal_01x04 J11
U 1 1 5F4B17C9
P 8500 9950
F 0 "J11" V 8372 10130 50  0000 L CNN
F 1 "WIEGAND" V 8463 10130 50  0000 L CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-4-5.08_1x04_P5.08mm_Horizontal" H 8500 9950 50  0001 C CNN
F 3 "~" H 8500 9950 50  0001 C CNN
	1    8500 9950
	0    1    1    0   
$EndComp
Wire Wire Line
	8300 9750 8300 9650
Wire Wire Line
	8400 9750 8400 9500
$Comp
L power:GND #PWR039
U 1 1 5F4CF428
P 7300 9750
F 0 "#PWR039" H 7300 9500 50  0001 C CNN
F 1 "GND" V 7305 9622 50  0000 R CNN
F 2 "" H 7300 9750 50  0001 C CNN
F 3 "" H 7300 9750 50  0001 C CNN
	1    7300 9750
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR038
U 1 1 5F4CFC36
P 7300 9400
F 0 "#PWR038" H 7300 9250 50  0001 C CNN
F 1 "+12V" V 7315 9528 50  0000 L CNN
F 2 "" H 7300 9400 50  0001 C CNN
F 3 "" H 7300 9400 50  0001 C CNN
	1    7300 9400
	1    0    0    -1  
$EndComp
Wire Wire Line
	8050 9350 8500 9350
Wire Wire Line
	8500 9350 8500 9750
Wire Wire Line
	8050 9200 8600 9200
Wire Wire Line
	8600 9200 8600 9750
$Comp
L Device:R R17
U 1 1 5F5127FC
P 3050 8700
F 0 "R17" V 2843 8700 50  0000 C CNN
F 1 "1k" V 2934 8700 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 2980 8700 50  0001 C CNN
F 3 "~" H 3050 8700 50  0001 C CNN
	1    3050 8700
	-1   0    0    1   
$EndComp
$Comp
L power:+5V #PWR029
U 1 1 5F55A4AD
P 2650 8200
F 0 "#PWR029" H 2650 8050 50  0001 C CNN
F 1 "+5V" V 2665 8328 50  0000 L CNN
F 2 "" H 2650 8200 50  0001 C CNN
F 3 "" H 2650 8200 50  0001 C CNN
	1    2650 8200
	1    0    0    -1  
$EndComp
$Comp
L Device:R R9
U 1 1 5F56C099
P 3650 8700
F 0 "R9" V 3443 8700 50  0000 C CNN
F 1 "1k" V 3534 8700 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 3580 8700 50  0001 C CNN
F 3 "~" H 3650 8700 50  0001 C CNN
	1    3650 8700
	-1   0    0    1   
$EndComp
$Comp
L Regulator_Switching:LMR16006YQ U1
U 1 1 5FE4D66F
P 2450 5450
F 0 "U1" H 2450 5917 50  0000 C CNN
F 1 "LMR16006YQ" H 2450 5826 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-6" H 2450 4950 50  0001 C CIN
F 3 "http://www.ti.com/lit/ds/symlink/lmr16006y-q1.pdf" H 2050 5900 50  0001 C CNN
	1    2450 5450
	1    0    0    -1  
$EndComp
Wire Wire Line
	950  5250 950  4750
Connection ~ 950  5250
$Comp
L Device:C C1
U 1 1 5FF1C350
P 950 5700
F 0 "C1" H 1065 5746 50  0000 L CNN
F 1 "2.2uF 25V" H 1065 5655 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 988 5550 50  0001 C CNN
F 3 "~" H 950 5700 50  0001 C CNN
	1    950  5700
	1    0    0    -1  
$EndComp
Wire Wire Line
	950  5850 950  5900
$Comp
L power:GND #PWR04
U 1 1 5FF1CCA8
P 950 5900
F 0 "#PWR04" H 950 5650 50  0001 C CNN
F 1 "GND" H 955 5727 50  0000 C CNN
F 2 "" H 950 5900 50  0001 C CNN
F 3 "" H 950 5900 50  0001 C CNN
	1    950  5900
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR01
U 1 1 5FF1D283
P 950 4750
F 0 "#PWR01" H 950 4600 50  0001 C CNN
F 1 "+12V" H 965 4923 50  0000 C CNN
F 2 "" H 950 4750 50  0001 C CNN
F 3 "" H 950 4750 50  0001 C CNN
	1    950  4750
	1    0    0    -1  
$EndComp
$Comp
L Device:L L1
U 1 1 5FF1FF73
P 3800 5450
F 0 "L1" V 3619 5450 50  0000 C CNN
F 1 "22uH" V 3710 5450 50  0000 C CNN
F 2 "Inductor_SMD:L_Bourns_SRN6045TA" H 3800 5450 50  0001 C CNN
F 3 "~" H 3800 5450 50  0001 C CNN
	1    3800 5450
	0    1    1    0   
$EndComp
$Comp
L Device:C C2
U 1 1 5FF209AE
P 3250 5250
F 0 "C2" V 2998 5250 50  0000 C CNN
F 1 "100nF" V 3089 5250 50  0000 C CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 3288 5100 50  0001 C CNN
F 3 "~" H 3250 5250 50  0001 C CNN
	1    3250 5250
	0    1    1    0   
$EndComp
Wire Wire Line
	2950 5250 3100 5250
Wire Wire Line
	3400 5250 3500 5250
Wire Wire Line
	3500 5250 3500 5450
Wire Wire Line
	3650 5450 3500 5450
Connection ~ 3500 5450
Wire Wire Line
	3500 5450 2950 5450
Wire Wire Line
	3500 5750 3500 5850
$Comp
L power:GND #PWR06
U 1 1 5FF797D0
P 3500 5850
F 0 "#PWR06" H 3500 5600 50  0001 C CNN
F 1 "GND" H 3505 5677 50  0000 C CNN
F 2 "" H 3500 5850 50  0001 C CNN
F 3 "" H 3500 5850 50  0001 C CNN
	1    3500 5850
	1    0    0    -1  
$EndComp
Wire Wire Line
	3950 5450 4300 5450
Wire Wire Line
	4300 6250 3150 6250
Wire Wire Line
	3150 6250 3150 5650
Wire Wire Line
	3150 5650 2950 5650
Connection ~ 4300 6250
Wire Wire Line
	4300 6250 4300 6500
$Comp
L Device:R R1
U 1 1 5FFA8957
P 4300 5850
F 0 "R1" H 4370 5896 50  0000 L CNN
F 1 "54.9k" H 4370 5805 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 4230 5850 50  0001 C CNN
F 3 "~" H 4300 5850 50  0001 C CNN
	1    4300 5850
	1    0    0    -1  
$EndComp
Wire Wire Line
	4300 5450 4300 5700
Wire Wire Line
	4300 6000 4300 6250
$Comp
L Device:R R2
U 1 1 5FFAB252
P 4300 6650
F 0 "R2" H 4370 6696 50  0000 L CNN
F 1 "10k" H 4370 6605 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 4230 6650 50  0001 C CNN
F 3 "~" H 4300 6650 50  0001 C CNN
	1    4300 6650
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR07
U 1 1 5FFAC026
P 4300 6900
F 0 "#PWR07" H 4300 6650 50  0001 C CNN
F 1 "GND" H 4305 6727 50  0000 C CNN
F 2 "" H 4300 6900 50  0001 C CNN
F 3 "" H 4300 6900 50  0001 C CNN
	1    4300 6900
	1    0    0    -1  
$EndComp
Wire Wire Line
	4300 6800 4300 6900
Wire Wire Line
	4300 5450 4800 5450
Wire Wire Line
	4800 5450 4800 5250
Connection ~ 4300 5450
Wire Wire Line
	4800 5450 4800 5600
Connection ~ 4800 5450
$Comp
L Device:C C3
U 1 1 5FFF4BBA
P 4800 5750
F 0 "C3" H 4915 5796 50  0000 L CNN
F 1 "10uF" H 4915 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 4838 5600 50  0001 C CNN
F 3 "~" H 4800 5750 50  0001 C CNN
	1    4800 5750
	1    0    0    -1  
$EndComp
Wire Wire Line
	4800 5900 4800 6100
$Comp
L power:+5V #PWR08
U 1 1 5FFF5BA8
P 4800 5250
F 0 "#PWR08" H 4800 5100 50  0001 C CNN
F 1 "+5V" H 4815 5423 50  0000 C CNN
F 2 "" H 4800 5250 50  0001 C CNN
F 3 "" H 4800 5250 50  0001 C CNN
	1    4800 5250
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR011
U 1 1 5FFF64F9
P 4800 6100
F 0 "#PWR011" H 4800 5850 50  0001 C CNN
F 1 "GND" H 4805 5927 50  0000 C CNN
F 2 "" H 4800 6100 50  0001 C CNN
F 3 "" H 4800 6100 50  0001 C CNN
	1    4800 6100
	1    0    0    -1  
$EndComp
Wire Wire Line
	2450 5850 2450 6100
$Comp
L power:GND #PWR05
U 1 1 60010B9D
P 2450 6100
F 0 "#PWR05" H 2450 5850 50  0001 C CNN
F 1 "GND" H 2455 5927 50  0000 C CNN
F 2 "" H 2450 6100 50  0001 C CNN
F 3 "" H 2450 6100 50  0001 C CNN
	1    2450 6100
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_02x05_Odd_Even J10
U 1 1 600CAD96
P 8000 7350
F 0 "J10" H 8050 7767 50  0000 C CNN
F 1 "W5500 Shield" H 8050 7676 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_2x05_P2.54mm_Vertical" H 8000 7350 50  0001 C CNN
F 3 "~" H 8000 7350 50  0001 C CNN
	1    8000 7350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR015
U 1 1 60103F06
P 8800 7600
F 0 "#PWR015" H 8800 7350 50  0001 C CNN
F 1 "GND" H 8805 7427 50  0000 C CNN
F 2 "" H 8800 7600 50  0001 C CNN
F 3 "" H 8800 7600 50  0001 C CNN
	1    8800 7600
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR017
U 1 1 601044AD
P 8450 6850
F 0 "#PWR017" H 8450 6700 50  0001 C CNN
F 1 "+5V" H 8465 7023 50  0000 C CNN
F 2 "" H 8450 6850 50  0001 C CNN
F 3 "" H 8450 6850 50  0001 C CNN
	1    8450 6850
	1    0    0    -1  
$EndComp
Wire Wire Line
	11950 2300 12200 2300
Wire Wire Line
	12500 2300 12750 2300
Wire Wire Line
	13050 1900 12100 1900
Wire Wire Line
	12100 1900 12100 1650
Wire Wire Line
	13050 1100 12650 1100
Wire Wire Line
	12100 1100 12100 1350
$Comp
L Device:R R7
U 1 1 6023AA94
P 12500 1100
F 0 "R7" V 12293 1100 50  0000 C CNN
F 1 "150" V 12384 1100 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12430 1100 50  0001 C CNN
F 3 "~" H 12500 1100 50  0001 C CNN
	1    12500 1100
	0    1    1    0   
$EndComp
Wire Wire Line
	12350 1100 12100 1100
$Comp
L dk_Transistors-Bipolar-BJT-Single:2N2222A Q1
U 1 1 6023F6EA
P 12950 2300
F 0 "Q1" H 13138 2353 60  0000 L CNN
F 1 "2N2222A" H 13138 2247 60  0000 L CNN
F 2 "digikey-footprints:TO-18-3" H 13150 2500 60  0001 L CNN
F 3 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 2600 60  0001 L CNN
F 4 "2N2222ACS-ND" H 13150 2700 60  0001 L CNN "Digi-Key_PN"
F 5 "2N2222A" H 13150 2800 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13150 2900 60  0001 L CNN "Category"
F 7 "Transistors - Bipolar (BJT) - Single" H 13150 3000 60  0001 L CNN "Family"
F 8 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 3100 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/central-semiconductor-corp/2N2222A/2N2222ACS-ND/4806845" H 13150 3200 60  0001 L CNN "DK_Detail_Page"
F 10 "TRANS NPN 40V 0.8A TO-18" H 13150 3300 60  0001 L CNN "Description"
F 11 "Central Semiconductor Corp" H 13150 3400 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13150 3500 60  0001 L CNN "Status"
	1    12950 2300
	1    0    0    -1  
$EndComp
$Comp
L dk_Power-Relays-Over-2-Amps:G5LE-14_DC5 RLY1
U 1 1 60240772
P 13900 1500
F 0 "RLY1" H 14228 1546 50  0000 L CNN
F 1 "G5LE-14_DC5" H 14228 1455 50  0000 L CNN
F 2 "digikey-footprints:Relay_THT_G5LE-14" H 14100 1700 50  0001 L CNN
F 3 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 1800 60  0001 L CNN
F 4 "Z1011-ND" H 14100 1900 60  0001 L CNN "Digi-Key_PN"
F 5 "G5LE-14 DC5" H 14100 2000 60  0001 L CNN "MPN"
F 6 "Relays" H 14100 2100 60  0001 L CNN "Category"
F 7 "Power Relays, Over 2 Amps" H 14100 2200 60  0001 L CNN "Family"
F 8 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 2300 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/omron-electronics-inc-emc-div/G5LE-14-DC5/Z1011-ND/280371" H 14100 2400 60  0001 L CNN "DK_Detail_Page"
F 10 "RELAY GEN PURPOSE SPDT 10A 5V" H 14100 2500 60  0001 L CNN "Description"
F 11 "Omron Electronics Inc-EMC Div" H 14100 2600 60  0001 L CNN "Manufacturer"
F 12 "Active" H 14100 2700 60  0001 L CNN "Status"
	1    13900 1500
	1    0    0    -1  
$EndComp
Wire Wire Line
	13900 950  13900 1200
Wire Wire Line
	13900 950  15700 950 
Wire Wire Line
	14100 1200 14100 1100
Wire Wire Line
	14100 1100 14700 1100
$Comp
L Connector:Screw_Terminal_01x03 J12
U 1 1 60290A06
P 15300 3750
F 0 "J12" H 15380 3792 50  0000 L CNN
F 1 "RELAY2" H 15380 3701 50  0000 L CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-3-5.08_1x03_P5.08mm_Horizontal" H 15300 3750 50  0001 C CNN
F 3 "~" H 15300 3750 50  0001 C CNN
	1    15300 3750
	1    0    0    -1  
$EndComp
Wire Wire Line
	15100 3750 14700 3750
Wire Wire Line
	14700 3750 14700 4150
Wire Wire Line
	14700 4150 14000 4150
Wire Wire Line
	14000 4150 14000 4050
Wire Wire Line
	15100 3650 14700 3650
Wire Wire Line
	14700 3650 14700 3350
$Comp
L power:+5V #PWR018
U 1 1 60290A12
P 13050 3250
F 0 "#PWR018" H 13050 3100 50  0001 C CNN
F 1 "+5V" H 13065 3423 50  0000 C CNN
F 2 "" H 13050 3250 50  0001 C CNN
F 3 "" H 13050 3250 50  0001 C CNN
	1    13050 3250
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 3550 13050 3350
Wire Wire Line
	13700 3450 13700 3350
Wire Wire Line
	13700 3350 13050 3350
Connection ~ 13050 3350
Wire Wire Line
	13050 3350 13050 3250
Wire Wire Line
	15100 3850 15000 3850
Wire Wire Line
	15000 3850 15000 4100
Wire Wire Line
	15000 4100 15700 4100
Wire Wire Line
	15700 4100 15700 3200
Connection ~ 13050 4150
Wire Wire Line
	13050 4350 13050 4150
Wire Wire Line
	13050 4750 13050 4950
$Comp
L power:GND #PWR021
U 1 1 60290A24
P 13050 4950
F 0 "#PWR021" H 13050 4700 50  0001 C CNN
F 1 "GND" H 13055 4777 50  0000 C CNN
F 2 "" H 13050 4950 50  0001 C CNN
F 3 "" H 13050 4950 50  0001 C CNN
	1    13050 4950
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 4150 13050 3950
Wire Wire Line
	13700 4150 13050 4150
Wire Wire Line
	13700 4050 13700 4150
$Comp
L Device:LED D4
U 1 1 60290A33
P 12100 3750
F 0 "D4" V 12054 3878 50  0000 L CNN
F 1 "RELAY2" V 12145 3878 50  0000 L CNN
F 2 "Diode_THT:D_A-405_P2.54mm_Vertical_AnodeUp" H 12100 3750 50  0001 C CNN
F 3 "~" H 12100 3750 50  0001 C CNN
	1    12100 3750
	0    -1   -1   0   
$EndComp
$Comp
L Device:R R3
U 1 1 60290A3A
P 12350 4550
F 0 "R3" V 12143 4550 50  0000 C CNN
F 1 "1k" V 12234 4550 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12280 4550 50  0001 C CNN
F 3 "~" H 12350 4550 50  0001 C CNN
	1    12350 4550
	0    1    1    0   
$EndComp
Wire Wire Line
	11950 4550 12200 4550
Wire Wire Line
	12500 4550 12750 4550
Wire Wire Line
	13050 4150 12100 4150
Wire Wire Line
	12100 4150 12100 3900
Wire Wire Line
	13050 3350 12650 3350
Wire Wire Line
	12100 3350 12100 3600
$Comp
L Device:R R10
U 1 1 60290A46
P 12500 3350
F 0 "R10" V 12293 3350 50  0000 C CNN
F 1 "150" V 12384 3350 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12430 3350 50  0001 C CNN
F 3 "~" H 12500 3350 50  0001 C CNN
	1    12500 3350
	0    1    1    0   
$EndComp
Wire Wire Line
	12350 3350 12100 3350
$Comp
L dk_Transistors-Bipolar-BJT-Single:2N2222A Q2
U 1 1 60290A56
P 12950 4550
F 0 "Q2" H 13138 4603 60  0000 L CNN
F 1 "2N2222A" H 13138 4497 60  0000 L CNN
F 2 "digikey-footprints:TO-18-3" H 13150 4750 60  0001 L CNN
F 3 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 4850 60  0001 L CNN
F 4 "2N2222ACS-ND" H 13150 4950 60  0001 L CNN "Digi-Key_PN"
F 5 "2N2222A" H 13150 5050 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13150 5150 60  0001 L CNN "Category"
F 7 "Transistors - Bipolar (BJT) - Single" H 13150 5250 60  0001 L CNN "Family"
F 8 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 5350 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/central-semiconductor-corp/2N2222A/2N2222ACS-ND/4806845" H 13150 5450 60  0001 L CNN "DK_Detail_Page"
F 10 "TRANS NPN 40V 0.8A TO-18" H 13150 5550 60  0001 L CNN "Description"
F 11 "Central Semiconductor Corp" H 13150 5650 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13150 5750 60  0001 L CNN "Status"
	1    12950 4550
	1    0    0    -1  
$EndComp
$Comp
L dk_Power-Relays-Over-2-Amps:G5LE-14_DC5 RLY2
U 1 1 60290A65
P 13900 3750
F 0 "RLY2" H 14228 3796 50  0000 L CNN
F 1 "G5LE-14_DC5" H 14228 3705 50  0000 L CNN
F 2 "digikey-footprints:Relay_THT_G5LE-14" H 14100 3950 50  0001 L CNN
F 3 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 4050 60  0001 L CNN
F 4 "Z1011-ND" H 14100 4150 60  0001 L CNN "Digi-Key_PN"
F 5 "G5LE-14 DC5" H 14100 4250 60  0001 L CNN "MPN"
F 6 "Relays" H 14100 4350 60  0001 L CNN "Category"
F 7 "Power Relays, Over 2 Amps" H 14100 4450 60  0001 L CNN "Family"
F 8 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 4550 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/omron-electronics-inc-emc-div/G5LE-14-DC5/Z1011-ND/280371" H 14100 4650 60  0001 L CNN "DK_Detail_Page"
F 10 "RELAY GEN PURPOSE SPDT 10A 5V" H 14100 4750 60  0001 L CNN "Description"
F 11 "Omron Electronics Inc-EMC Div" H 14100 4850 60  0001 L CNN "Manufacturer"
F 12 "Active" H 14100 4950 60  0001 L CNN "Status"
	1    13900 3750
	1    0    0    -1  
$EndComp
Wire Wire Line
	13900 3200 13900 3450
Wire Wire Line
	13900 3200 15700 3200
Wire Wire Line
	14100 3450 14100 3350
Wire Wire Line
	14100 3350 14700 3350
$Comp
L Connector:Screw_Terminal_01x03 J13
U 1 1 602A30AE
P 15300 6000
F 0 "J13" H 15380 6042 50  0000 L CNN
F 1 "RELAY3" H 15380 5951 50  0000 L CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-3-5.08_1x03_P5.08mm_Horizontal" H 15300 6000 50  0001 C CNN
F 3 "~" H 15300 6000 50  0001 C CNN
	1    15300 6000
	1    0    0    -1  
$EndComp
Wire Wire Line
	15100 6000 14700 6000
Wire Wire Line
	14700 6000 14700 6400
Wire Wire Line
	14700 6400 14000 6400
Wire Wire Line
	14000 6400 14000 6300
Wire Wire Line
	15100 5900 14700 5900
Wire Wire Line
	14700 5900 14700 5600
$Comp
L power:+5V #PWR022
U 1 1 602A30BA
P 13050 5500
F 0 "#PWR022" H 13050 5350 50  0001 C CNN
F 1 "+5V" H 13065 5673 50  0000 C CNN
F 2 "" H 13050 5500 50  0001 C CNN
F 3 "" H 13050 5500 50  0001 C CNN
	1    13050 5500
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 5800 13050 5600
Wire Wire Line
	13700 5700 13700 5600
Wire Wire Line
	13700 5600 13050 5600
Connection ~ 13050 5600
Wire Wire Line
	13050 5600 13050 5500
Wire Wire Line
	15100 6100 15000 6100
Wire Wire Line
	15000 6100 15000 6350
Wire Wire Line
	15000 6350 15700 6350
Wire Wire Line
	15700 6350 15700 5450
Connection ~ 13050 6400
Wire Wire Line
	13050 6600 13050 6400
Wire Wire Line
	13050 7000 13050 7200
$Comp
L power:GND #PWR024
U 1 1 602A30CC
P 13050 7200
F 0 "#PWR024" H 13050 6950 50  0001 C CNN
F 1 "GND" H 13055 7027 50  0000 C CNN
F 2 "" H 13050 7200 50  0001 C CNN
F 3 "" H 13050 7200 50  0001 C CNN
	1    13050 7200
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 6400 13050 6200
Wire Wire Line
	13700 6400 13050 6400
Wire Wire Line
	13700 6300 13700 6400
$Comp
L Device:LED D5
U 1 1 602A30DB
P 12100 6000
F 0 "D5" V 12054 6128 50  0000 L CNN
F 1 "RELAY3" V 12145 6128 50  0000 L CNN
F 2 "Diode_THT:D_A-405_P2.54mm_Vertical_AnodeUp" H 12100 6000 50  0001 C CNN
F 3 "~" H 12100 6000 50  0001 C CNN
	1    12100 6000
	0    -1   -1   0   
$EndComp
$Comp
L Device:R R4
U 1 1 602A30E2
P 12350 6800
F 0 "R4" V 12143 6800 50  0000 C CNN
F 1 "1k" V 12234 6800 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12280 6800 50  0001 C CNN
F 3 "~" H 12350 6800 50  0001 C CNN
	1    12350 6800
	0    1    1    0   
$EndComp
Wire Wire Line
	11950 6800 12200 6800
Wire Wire Line
	12500 6800 12750 6800
Wire Wire Line
	13050 6400 12100 6400
Wire Wire Line
	12100 6400 12100 6150
Wire Wire Line
	13050 5600 12650 5600
Wire Wire Line
	12100 5600 12100 5850
$Comp
L Device:R R13
U 1 1 602A30EE
P 12500 5600
F 0 "R13" V 12293 5600 50  0000 C CNN
F 1 "150" V 12384 5600 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12430 5600 50  0001 C CNN
F 3 "~" H 12500 5600 50  0001 C CNN
	1    12500 5600
	0    1    1    0   
$EndComp
Wire Wire Line
	12350 5600 12100 5600
$Comp
L dk_Transistors-Bipolar-BJT-Single:2N2222A Q3
U 1 1 602A30FE
P 12950 6800
F 0 "Q3" H 13138 6853 60  0000 L CNN
F 1 "2N2222A" H 13138 6747 60  0000 L CNN
F 2 "digikey-footprints:TO-18-3" H 13150 7000 60  0001 L CNN
F 3 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 7100 60  0001 L CNN
F 4 "2N2222ACS-ND" H 13150 7200 60  0001 L CNN "Digi-Key_PN"
F 5 "2N2222A" H 13150 7300 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13150 7400 60  0001 L CNN "Category"
F 7 "Transistors - Bipolar (BJT) - Single" H 13150 7500 60  0001 L CNN "Family"
F 8 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 7600 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/central-semiconductor-corp/2N2222A/2N2222ACS-ND/4806845" H 13150 7700 60  0001 L CNN "DK_Detail_Page"
F 10 "TRANS NPN 40V 0.8A TO-18" H 13150 7800 60  0001 L CNN "Description"
F 11 "Central Semiconductor Corp" H 13150 7900 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13150 8000 60  0001 L CNN "Status"
	1    12950 6800
	1    0    0    -1  
$EndComp
$Comp
L dk_Power-Relays-Over-2-Amps:G5LE-14_DC5 RLY3
U 1 1 602A310D
P 13900 6000
F 0 "RLY3" H 14228 6046 50  0000 L CNN
F 1 "G5LE-14_DC5" H 14228 5955 50  0000 L CNN
F 2 "digikey-footprints:Relay_THT_G5LE-14" H 14100 6200 50  0001 L CNN
F 3 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 6300 60  0001 L CNN
F 4 "Z1011-ND" H 14100 6400 60  0001 L CNN "Digi-Key_PN"
F 5 "G5LE-14 DC5" H 14100 6500 60  0001 L CNN "MPN"
F 6 "Relays" H 14100 6600 60  0001 L CNN "Category"
F 7 "Power Relays, Over 2 Amps" H 14100 6700 60  0001 L CNN "Family"
F 8 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 6800 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/omron-electronics-inc-emc-div/G5LE-14-DC5/Z1011-ND/280371" H 14100 6900 60  0001 L CNN "DK_Detail_Page"
F 10 "RELAY GEN PURPOSE SPDT 10A 5V" H 14100 7000 60  0001 L CNN "Description"
F 11 "Omron Electronics Inc-EMC Div" H 14100 7100 60  0001 L CNN "Manufacturer"
F 12 "Active" H 14100 7200 60  0001 L CNN "Status"
	1    13900 6000
	1    0    0    -1  
$EndComp
Wire Wire Line
	13900 5450 13900 5700
Wire Wire Line
	13900 5450 15700 5450
Wire Wire Line
	14100 5700 14100 5600
Wire Wire Line
	14100 5600 14700 5600
$Comp
L Connector:Screw_Terminal_01x03 J14
U 1 1 602B6B21
P 15300 8250
F 0 "J14" H 15380 8292 50  0000 L CNN
F 1 "RELAY4" H 15380 8201 50  0000 L CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-3-5.08_1x03_P5.08mm_Horizontal" H 15300 8250 50  0001 C CNN
F 3 "~" H 15300 8250 50  0001 C CNN
	1    15300 8250
	1    0    0    -1  
$EndComp
Wire Wire Line
	15100 8250 14700 8250
Wire Wire Line
	14700 8250 14700 8650
Wire Wire Line
	14700 8650 14000 8650
Wire Wire Line
	14000 8650 14000 8550
Wire Wire Line
	15100 8150 14700 8150
Wire Wire Line
	14700 8150 14700 7850
$Comp
L power:+5V #PWR025
U 1 1 602B6B2D
P 13050 7750
F 0 "#PWR025" H 13050 7600 50  0001 C CNN
F 1 "+5V" H 13065 7923 50  0000 C CNN
F 2 "" H 13050 7750 50  0001 C CNN
F 3 "" H 13050 7750 50  0001 C CNN
	1    13050 7750
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 8050 13050 7850
Wire Wire Line
	13700 7950 13700 7850
Wire Wire Line
	13700 7850 13050 7850
Connection ~ 13050 7850
Wire Wire Line
	13050 7850 13050 7750
Wire Wire Line
	15100 8350 15000 8350
Wire Wire Line
	15000 8350 15000 8600
Wire Wire Line
	15000 8600 15700 8600
Wire Wire Line
	15700 8600 15700 7700
Connection ~ 13050 8650
Wire Wire Line
	13050 8850 13050 8650
Wire Wire Line
	13050 9250 13050 9450
$Comp
L power:GND #PWR026
U 1 1 602B6B3F
P 13050 9450
F 0 "#PWR026" H 13050 9200 50  0001 C CNN
F 1 "GND" H 13055 9277 50  0000 C CNN
F 2 "" H 13050 9450 50  0001 C CNN
F 3 "" H 13050 9450 50  0001 C CNN
	1    13050 9450
	1    0    0    -1  
$EndComp
Wire Wire Line
	13050 8650 13050 8450
Wire Wire Line
	13700 8650 13050 8650
Wire Wire Line
	13700 8550 13700 8650
$Comp
L Device:R R5
U 1 1 602B6B55
P 12350 9050
F 0 "R5" V 12143 9050 50  0000 C CNN
F 1 "1k" V 12234 9050 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12280 9050 50  0001 C CNN
F 3 "~" H 12350 9050 50  0001 C CNN
	1    12350 9050
	0    1    1    0   
$EndComp
Wire Wire Line
	11950 9050 12200 9050
Wire Wire Line
	12500 9050 12750 9050
Wire Wire Line
	13050 8650 12100 8650
Wire Wire Line
	12100 8650 12100 8400
Wire Wire Line
	13050 7850 12650 7850
Wire Wire Line
	12100 7850 12100 8100
$Comp
L Device:R R14
U 1 1 602B6B61
P 12500 7850
F 0 "R14" V 12293 7850 50  0000 C CNN
F 1 "150" V 12384 7850 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 12430 7850 50  0001 C CNN
F 3 "~" H 12500 7850 50  0001 C CNN
	1    12500 7850
	0    1    1    0   
$EndComp
Wire Wire Line
	12350 7850 12100 7850
$Comp
L dk_Transistors-Bipolar-BJT-Single:2N2222A Q4
U 1 1 602B6B71
P 12950 9050
F 0 "Q4" H 13138 9103 60  0000 L CNN
F 1 "2N2222A" H 13138 8997 60  0000 L CNN
F 2 "digikey-footprints:TO-18-3" H 13150 9250 60  0001 L CNN
F 3 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 9350 60  0001 L CNN
F 4 "2N2222ACS-ND" H 13150 9450 60  0001 L CNN "Digi-Key_PN"
F 5 "2N2222A" H 13150 9550 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13150 9650 60  0001 L CNN "Category"
F 7 "Transistors - Bipolar (BJT) - Single" H 13150 9750 60  0001 L CNN "Family"
F 8 "https://my.centralsemi.com/get_document.php?cmp=1&mergetype=pd&mergepath=pd&pdf_id=2N2221A.PDF" H 13150 9850 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/central-semiconductor-corp/2N2222A/2N2222ACS-ND/4806845" H 13150 9950 60  0001 L CNN "DK_Detail_Page"
F 10 "TRANS NPN 40V 0.8A TO-18" H 13150 10050 60  0001 L CNN "Description"
F 11 "Central Semiconductor Corp" H 13150 10150 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13150 10250 60  0001 L CNN "Status"
	1    12950 9050
	1    0    0    -1  
$EndComp
$Comp
L dk_Power-Relays-Over-2-Amps:G5LE-14_DC5 RLY4
U 1 1 602B6B80
P 13900 8250
F 0 "RLY4" H 14228 8296 50  0000 L CNN
F 1 "G5LE-14_DC5" H 14228 8205 50  0000 L CNN
F 2 "digikey-footprints:Relay_THT_G5LE-14" H 14100 8450 50  0001 L CNN
F 3 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 8550 60  0001 L CNN
F 4 "Z1011-ND" H 14100 8650 60  0001 L CNN "Digi-Key_PN"
F 5 "G5LE-14 DC5" H 14100 8750 60  0001 L CNN "MPN"
F 6 "Relays" H 14100 8850 60  0001 L CNN "Category"
F 7 "Power Relays, Over 2 Amps" H 14100 8950 60  0001 L CNN "Family"
F 8 "https://omronfs.omron.com/en_US/ecb/products/pdf/en-g5le.pdf" H 14100 9050 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/omron-electronics-inc-emc-div/G5LE-14-DC5/Z1011-ND/280371" H 14100 9150 60  0001 L CNN "DK_Detail_Page"
F 10 "RELAY GEN PURPOSE SPDT 10A 5V" H 14100 9250 60  0001 L CNN "Description"
F 11 "Omron Electronics Inc-EMC Div" H 14100 9350 60  0001 L CNN "Manufacturer"
F 12 "Active" H 14100 9450 60  0001 L CNN "Status"
	1    13900 8250
	1    0    0    -1  
$EndComp
Wire Wire Line
	13900 7700 13900 7950
Wire Wire Line
	13900 7700 15700 7700
Wire Wire Line
	14100 7950 14100 7850
Wire Wire Line
	14100 7850 14700 7850
$Comp
L dk_Diodes-Rectifiers-Single:S1G D7
U 1 1 6039EDE7
P 13050 1500
F 0 "D7" V 13103 1422 60  0000 R CNN
F 1 "S1G" V 12997 1422 60  0000 R CNN
F 2 "digikey-footprints:DO-214AC" H 13250 1700 60  0001 L CNN
F 3 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 1800 60  0001 L CNN
F 4 "S1GFSCT-ND" H 13250 1900 60  0001 L CNN "Digi-Key_PN"
F 5 "S1G" H 13250 2000 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13250 2100 60  0001 L CNN "Category"
F 7 "Diodes - Rectifiers - Single" H 13250 2200 60  0001 L CNN "Family"
F 8 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 2300 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/on-semiconductor/S1G/S1GFSCT-ND/965720" H 13250 2400 60  0001 L CNN "DK_Detail_Page"
F 10 "DIODE GEN PURP 400V 1A SMA" H 13250 2500 60  0001 L CNN "Description"
F 11 "ON Semiconductor" H 13250 2600 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13250 2700 60  0001 L CNN "Status"
	1    13050 1500
	0    -1   -1   0   
$EndComp
$Comp
L dk_Diodes-Rectifiers-Single:S1G D8
U 1 1 603A8368
P 13050 3750
F 0 "D8" V 13103 3672 60  0000 R CNN
F 1 "S1G" V 12997 3672 60  0000 R CNN
F 2 "digikey-footprints:DO-214AC" H 13250 3950 60  0001 L CNN
F 3 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 4050 60  0001 L CNN
F 4 "S1GFSCT-ND" H 13250 4150 60  0001 L CNN "Digi-Key_PN"
F 5 "S1G" H 13250 4250 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13250 4350 60  0001 L CNN "Category"
F 7 "Diodes - Rectifiers - Single" H 13250 4450 60  0001 L CNN "Family"
F 8 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 4550 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/on-semiconductor/S1G/S1GFSCT-ND/965720" H 13250 4650 60  0001 L CNN "DK_Detail_Page"
F 10 "DIODE GEN PURP 400V 1A SMA" H 13250 4750 60  0001 L CNN "Description"
F 11 "ON Semiconductor" H 13250 4850 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13250 4950 60  0001 L CNN "Status"
	1    13050 3750
	0    -1   -1   0   
$EndComp
$Comp
L dk_Diodes-Rectifiers-Single:S1G D9
U 1 1 603AFB0A
P 13050 6000
F 0 "D9" V 13103 5922 60  0000 R CNN
F 1 "S1G" V 12997 5922 60  0000 R CNN
F 2 "digikey-footprints:DO-214AC" H 13250 6200 60  0001 L CNN
F 3 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 6300 60  0001 L CNN
F 4 "S1GFSCT-ND" H 13250 6400 60  0001 L CNN "Digi-Key_PN"
F 5 "S1G" H 13250 6500 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13250 6600 60  0001 L CNN "Category"
F 7 "Diodes - Rectifiers - Single" H 13250 6700 60  0001 L CNN "Family"
F 8 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 6800 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/on-semiconductor/S1G/S1GFSCT-ND/965720" H 13250 6900 60  0001 L CNN "DK_Detail_Page"
F 10 "DIODE GEN PURP 400V 1A SMA" H 13250 7000 60  0001 L CNN "Description"
F 11 "ON Semiconductor" H 13250 7100 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13250 7200 60  0001 L CNN "Status"
	1    13050 6000
	0    -1   -1   0   
$EndComp
$Comp
L dk_Diodes-Rectifiers-Single:S1G D10
U 1 1 603B4242
P 13050 8250
F 0 "D10" V 13103 8172 60  0000 R CNN
F 1 "S1G" V 12997 8172 60  0000 R CNN
F 2 "digikey-footprints:DO-214AC" H 13250 8450 60  0001 L CNN
F 3 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 8550 60  0001 L CNN
F 4 "S1GFSCT-ND" H 13250 8650 60  0001 L CNN "Digi-Key_PN"
F 5 "S1G" H 13250 8750 60  0001 L CNN "MPN"
F 6 "Discrete Semiconductor Products" H 13250 8850 60  0001 L CNN "Category"
F 7 "Diodes - Rectifiers - Single" H 13250 8950 60  0001 L CNN "Family"
F 8 "https://www.onsemi.com/pub/Collateral/S1M-D.pdf" H 13250 9050 60  0001 L CNN "DK_Datasheet_Link"
F 9 "/product-detail/en/on-semiconductor/S1G/S1GFSCT-ND/965720" H 13250 9150 60  0001 L CNN "DK_Detail_Page"
F 10 "DIODE GEN PURP 400V 1A SMA" H 13250 9250 60  0001 L CNN "Description"
F 11 "ON Semiconductor" H 13250 9350 60  0001 L CNN "Manufacturer"
F 12 "Active" H 13250 9450 60  0001 L CNN "Status"
	1    13050 8250
	0    -1   -1   0   
$EndComp
$Comp
L MCU_Microchip_ATmega:ATmega328P-AU U2
U 1 1 603BEB8F
P 6500 3750
F 0 "U2" H 6500 2161 50  0000 C CNN
F 1 "ATmega328P-AU" H 6500 2070 50  0000 C CNN
F 2 "Package_QFP:TQFP-32_7x7mm_P0.8mm" H 6500 3750 50  0001 C CIN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega328_P%20AVR%20MCU%20with%20picoPower%20Technology%20Data%20Sheet%2040001984A.pdf" H 6500 3750 50  0001 C CNN
	1    6500 3750
	1    0    0    -1  
$EndComp
Wire Wire Line
	950  5250 950  5550
Wire Wire Line
	950  5250 1950 5250
$Comp
L Diode:MBR0530 D2
U 1 1 604E3570
P 3500 5600
F 0 "D2" V 3454 5679 50  0000 L CNN
F 1 "MBR130T1G" V 3545 5679 50  0000 L CNN
F 2 "Diode_SMD:D_SOD-123" H 3500 5425 50  0001 C CNN
F 3 "" H 3500 5600 50  0001 C CNN
	1    3500 5600
	0    1    1    0   
$EndComp
$Comp
L Connector:Screw_Terminal_01x08 J4
U 1 1 6052FAE0
P 3350 10300
F 0 "J4" V 3222 10680 50  0000 L CNN
F 1 "Inputs" V 3313 10680 50  0000 L CNN
F 2 "TerminalBlock_Phoenix:TerminalBlock_Phoenix_MKDS-1,5-8-5.08_1x08_P5.08mm_Horizontal" H 3350 10300 50  0001 C CNN
F 3 "~" H 3350 10300 50  0001 C CNN
	1    3350 10300
	0    1    1    0   
$EndComp
$Comp
L Device:R R8
U 1 1 5F57F618
P 3450 8700
F 0 "R8" V 3243 8700 50  0000 C CNN
F 1 "1k" V 3334 8700 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 3380 8700 50  0001 C CNN
F 3 "~" H 3450 8700 50  0001 C CNN
	1    3450 8700
	-1   0    0    1   
$EndComp
Wire Wire Line
	2950 10100 2950 9900
Wire Wire Line
	2950 9900 2650 9900
Wire Wire Line
	2950 9900 3150 9900
Wire Wire Line
	3150 9900 3150 10100
Connection ~ 2950 9900
Wire Wire Line
	3150 9900 3350 9900
Wire Wire Line
	3350 9900 3350 10100
Connection ~ 3150 9900
Wire Wire Line
	3550 10100 3550 9900
Wire Wire Line
	3550 9900 3350 9900
Connection ~ 3350 9900
Wire Wire Line
	3050 8300 3250 8300
Connection ~ 3450 8300
Wire Wire Line
	3450 8300 3650 8300
Connection ~ 3250 8300
Wire Wire Line
	3250 8300 3450 8300
Wire Wire Line
	3050 8300 2650 8300
Connection ~ 3050 8300
Wire Wire Line
	3650 8550 3650 8300
Wire Wire Line
	3450 8550 3450 8300
Wire Wire Line
	3250 8550 3250 8300
Wire Wire Line
	3050 8550 3050 8300
Wire Wire Line
	3650 8850 3650 9750
Wire Wire Line
	3450 8850 3450 9600
Wire Wire Line
	3050 8850 3050 9300
Wire Wire Line
	3650 9750 3800 9750
Connection ~ 3650 9750
Wire Wire Line
	3650 9750 3650 10100
Wire Wire Line
	3450 9600 3800 9600
Connection ~ 3450 9600
Wire Wire Line
	3450 9600 3450 10100
Wire Wire Line
	3800 9450 3250 9450
Connection ~ 3250 9450
Wire Wire Line
	3250 9450 3250 10100
Wire Wire Line
	3050 9300 3800 9300
Connection ~ 3050 9300
Wire Wire Line
	3050 9300 3050 10100
Wire Wire Line
	3250 8850 3250 9450
$Comp
L Device:R R11
U 1 1 5F55A4B3
P 3250 8700
F 0 "R11" V 3043 8700 50  0000 C CNN
F 1 "1k" V 3134 8700 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 3180 8700 50  0001 C CNN
F 3 "~" H 3250 8700 50  0001 C CNN
	1    3250 8700
	-1   0    0    1   
$EndComp
$Comp
L Connector_Generic:Conn_01x06 J5
U 1 1 5F1552BD
P 8950 4850
F 0 "J5" H 9030 4842 50  0000 L CNN
F 1 "EXT RLY" H 9030 4751 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x06_P2.54mm_Vertical" H 8950 4850 50  0001 C CNN
F 3 "~" H 8950 4850 50  0001 C CNN
	1    8950 4850
	1    0    0    -1  
$EndComp
Wire Wire Line
	8750 5050 8550 5050
Wire Wire Line
	8750 5150 8550 5150
Wire Wire Line
	8550 5150 8550 5400
$Comp
L power:GND #PWR0101
U 1 1 5F1DE8C7
P 8550 5400
F 0 "#PWR0101" H 8550 5150 50  0001 C CNN
F 1 "GND" H 8555 5227 50  0000 C CNN
F 2 "" H 8550 5400 50  0001 C CNN
F 3 "" H 8550 5400 50  0001 C CNN
	1    8550 5400
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0102
U 1 1 5F1DEF6A
P 8550 4600
F 0 "#PWR0102" H 8550 4450 50  0001 C CNN
F 1 "+5V" H 8565 4773 50  0000 C CNN
F 2 "" H 8550 4600 50  0001 C CNN
F 3 "" H 8550 4600 50  0001 C CNN
	1    8550 4600
	1    0    0    -1  
$EndComp
Wire Wire Line
	1250 1950 1250 2400
Wire Wire Line
	1250 2400 1650 2400
Wire Wire Line
	1150 2600 1650 2600
Wire Wire Line
	1150 1950 1150 2600
$Comp
L power:GND #PWR0104
U 1 1 5F0912A5
P 9600 3750
F 0 "#PWR0104" H 9600 3500 50  0001 C CNN
F 1 "GND" H 9605 3577 50  0000 C CNN
F 2 "" H 9600 3750 50  0001 C CNN
F 3 "" H 9600 3750 50  0001 C CNN
	1    9600 3750
	1    0    0    -1  
$EndComp
$Comp
L Device:LED D11
U 1 1 5F0AA575
P 5350 6400
F 0 "D11" V 5389 6282 50  0000 R CNN
F 1 "5V" V 5298 6282 50  0000 R CNN
F 2 "Diode_THT:D_A-405_P2.54mm_Vertical_AnodeUp" H 5350 6400 50  0001 C CNN
F 3 "~" H 5350 6400 50  0001 C CNN
	1    5350 6400
	0    -1   -1   0   
$EndComp
Wire Wire Line
	5350 5800 5350 5450
Wire Wire Line
	5350 6550 5350 6650
$Comp
L power:GND #PWR0105
U 1 1 5F0AA57D
P 5350 6650
F 0 "#PWR0105" H 5350 6400 50  0001 C CNN
F 1 "GND" H 5355 6477 50  0000 C CNN
F 2 "" H 5350 6650 50  0001 C CNN
F 3 "" H 5350 6650 50  0001 C CNN
	1    5350 6650
	1    0    0    -1  
$EndComp
$Comp
L Device:R R15
U 1 1 5F0AA583
P 5350 5950
F 0 "R15" H 5420 5996 50  0000 L CNN
F 1 "150" H 5420 5905 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 5280 5950 50  0001 C CNN
F 3 "~" H 5350 5950 50  0001 C CNN
	1    5350 5950
	1    0    0    -1  
$EndComp
Wire Wire Line
	5350 6100 5350 6250
Wire Wire Line
	5350 5450 4800 5450
Wire Wire Line
	7800 7250 7500 7250
Wire Wire Line
	8300 7150 8450 7150
Wire Wire Line
	8450 7150 8450 6850
Wire Wire Line
	8300 7250 8800 7250
Wire Wire Line
	8300 7350 8550 7350
$Comp
L Device:LED D6
U 1 1 602B6B4E
P 12100 8250
F 0 "D6" V 12054 8378 50  0000 L CNN
F 1 "RELAY4" V 12145 8378 50  0000 L CNN
F 2 "Diode_THT:D_A-405_P2.54mm_Vertical_AnodeUp" H 12100 8250 50  0001 C CNN
F 3 "~" H 12100 8250 50  0001 C CNN
	1    12100 8250
	0    -1   -1   0   
$EndComp
$Comp
L power:GND #PWR019
U 1 1 5F56C08D
P 2650 10000
F 0 "#PWR019" H 2650 9750 50  0001 C CNN
F 1 "GND" V 2655 9872 50  0000 R CNN
F 2 "" H 2650 10000 50  0001 C CNN
F 3 "" H 2650 10000 50  0001 C CNN
	1    2650 10000
	1    0    0    -1  
$EndComp
Wire Wire Line
	2650 10000 2650 9900
Wire Wire Line
	2650 8300 2650 8200
Wire Wire Line
	7300 9650 7300 9750
Wire Wire Line
	7300 9650 8300 9650
Wire Wire Line
	7300 9400 7300 9500
Wire Wire Line
	7300 9500 8400 9500
Wire Wire Line
	8800 7600 8800 7250
Wire Wire Line
	4650 2050 4650 1950
Wire Wire Line
	9300 2000 9300 2100
Wire Wire Line
	9300 2750 9850 2750
Wire Wire Line
	9850 2750 9850 3750
Wire Wire Line
	9850 3750 9600 3750
Wire Wire Line
	9300 3750 9300 3650
Connection ~ 9600 3750
Wire Wire Line
	9600 3750 9300 3750
Wire Wire Line
	3500 2400 3500 2300
Wire Wire Line
	2800 2400 3500 2400
Wire Wire Line
	3500 2600 3500 2700
Wire Wire Line
	2900 2600 3500 2600
Connection ~ 5450 2050
Wire Wire Line
	4650 2050 4950 2050
$Comp
L Device:C C4
U 1 1 60413D66
P 5450 2350
F 0 "C4" H 5565 2396 50  0000 L CNN
F 1 "100nF" H 5565 2305 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 5488 2200 50  0001 C CNN
F 3 "~" H 5450 2350 50  0001 C CNN
	1    5450 2350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR014
U 1 1 60414832
P 5450 2600
F 0 "#PWR014" H 5450 2350 50  0001 C CNN
F 1 "GND" H 5455 2427 50  0000 C CNN
F 2 "" H 5450 2600 50  0001 C CNN
F 3 "" H 5450 2600 50  0001 C CNN
	1    5450 2600
	1    0    0    -1  
$EndComp
Wire Wire Line
	5450 2200 5450 2050
Wire Wire Line
	5450 2600 5450 2500
$Comp
L Device:C C5
U 1 1 5F543692
P 4950 2350
F 0 "C5" H 5065 2396 50  0000 L CNN
F 1 "100nF" H 5065 2305 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 4988 2200 50  0001 C CNN
F 3 "~" H 4950 2350 50  0001 C CNN
	1    4950 2350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0103
U 1 1 5F543698
P 4950 2600
F 0 "#PWR0103" H 4950 2350 50  0001 C CNN
F 1 "GND" H 4955 2427 50  0000 C CNN
F 2 "" H 4950 2600 50  0001 C CNN
F 3 "" H 4950 2600 50  0001 C CNN
	1    4950 2600
	1    0    0    -1  
$EndComp
Wire Wire Line
	4950 2200 4950 2050
Wire Wire Line
	4950 2600 4950 2500
Wire Wire Line
	8250 2000 8250 1900
Connection ~ 8250 2000
Wire Wire Line
	8250 2000 8000 2000
Wire Wire Line
	8250 1600 8250 1400
$Comp
L power:+5V #PWR0106
U 1 1 5F59FBF7
P 8250 1400
F 0 "#PWR0106" H 8250 1250 50  0001 C CNN
F 1 "+5V" H 8265 1573 50  0000 C CNN
F 2 "" H 8250 1400 50  0001 C CNN
F 3 "" H 8250 1400 50  0001 C CNN
	1    8250 1400
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_02x03_Odd_Even J6
U 1 1 5F5A0F12
P 10300 1300
F 0 "J6" H 10350 1617 50  0000 C CNN
F 1 "ICSP" H 10350 1526 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_2x03_P2.54mm_Vertical" H 10300 1300 50  0001 C CNN
F 3 "~" H 10300 1300 50  0001 C CNN
	1    10300 1300
	1    0    0    -1  
$EndComp
Text Label 9700 1200 2    50   ~ 0
MISO
Text Label 9700 1300 2    50   ~ 0
SCK
Text Label 9700 1400 2    50   ~ 0
RST
Text Label 10950 1300 0    50   ~ 0
MOSI
Wire Wire Line
	9700 1200 10100 1200
Wire Wire Line
	10100 1300 9700 1300
Wire Wire Line
	10100 1400 9700 1400
Wire Wire Line
	10600 1300 10950 1300
Wire Wire Line
	10600 1200 10800 1200
Wire Wire Line
	10800 1200 10800 1000
Wire Wire Line
	10600 1400 10800 1400
Wire Wire Line
	10800 1400 10800 1650
$Comp
L power:+5V #PWR0107
U 1 1 5F66944D
P 10800 1000
F 0 "#PWR0107" H 10800 850 50  0001 C CNN
F 1 "+5V" H 10815 1173 50  0000 C CNN
F 2 "" H 10800 1000 50  0001 C CNN
F 3 "" H 10800 1000 50  0001 C CNN
	1    10800 1000
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0108
U 1 1 5F669B79
P 10800 1650
F 0 "#PWR0108" H 10800 1400 50  0001 C CNN
F 1 "GND" H 10805 1477 50  0000 C CNN
F 2 "" H 10800 1650 50  0001 C CNN
F 3 "" H 10800 1650 50  0001 C CNN
	1    10800 1650
	1    0    0    -1  
$EndComp
Text Label 7500 2750 0    50   ~ 0
SS
Text Label 7500 2850 0    50   ~ 0
MOSI
Text Label 7500 2950 0    50   ~ 0
MISO
Text Label 7500 3050 0    50   ~ 0
SCK
Wire Wire Line
	8000 2000 8000 4050
Wire Wire Line
	7500 2750 7100 2750
Wire Wire Line
	7100 2850 7500 2850
Wire Wire Line
	7500 2950 7100 2950
Wire Wire Line
	7100 3050 7500 3050
Wire Wire Line
	8000 2000 7750 2000
Connection ~ 8000 2000
Text Label 7750 2000 0    50   ~ 0
RST
Text Label 7500 3750 0    50   ~ 0
INPUT1
Text Label 7500 3650 0    50   ~ 0
INPUT2
Text Label 7500 3550 0    50   ~ 0
INPUT3
Text Label 7500 3450 0    50   ~ 0
INPUT4
Wire Wire Line
	7500 3450 7100 3450
Wire Wire Line
	7100 3550 7500 3550
Wire Wire Line
	7500 3650 7100 3650
Wire Wire Line
	7100 3750 7500 3750
Text Label 7900 4450 0    50   ~ 0
WIEGAND0
Text Label 7900 4550 0    50   ~ 0
WIEGAND1
Wire Wire Line
	7100 4550 7900 4550
Text Label 7900 4650 0    50   ~ 0
RELAY4
Text Label 7900 4750 0    50   ~ 0
RELAY3
Text Label 7900 4850 0    50   ~ 0
RELAY2
Text Label 7900 4950 0    50   ~ 0
RELAY1
Wire Wire Line
	8550 5050 8550 4600
Wire Wire Line
	7100 4950 8750 4950
Wire Wire Line
	7100 4850 8750 4850
Wire Wire Line
	7100 4750 8750 4750
Wire Wire Line
	7100 4650 8750 4650
Connection ~ 8550 4600
Wire Wire Line
	8550 4600 8550 4450
Wire Wire Line
	7100 4350 8750 4350
Wire Wire Line
	7100 4250 8750 4250
Text Label 3800 9750 0    50   ~ 0
INPUT1
Text Label 3800 9600 0    50   ~ 0
INPUT2
Text Label 3800 9450 0    50   ~ 0
INPUT3
Text Label 3800 9300 0    50   ~ 0
INPUT4
Text Label 7500 7450 2    50   ~ 0
SS
Text Label 7500 7350 2    50   ~ 0
MOSI
Text Label 7500 7250 2    50   ~ 0
MISO
Text Label 7500 7550 2    50   ~ 0
SCK
Wire Wire Line
	7800 7350 7500 7350
Wire Wire Line
	7500 7450 7800 7450
Wire Wire Line
	7800 7550 7500 7550
Text Label 8550 7350 0    50   ~ 0
RST
Text Label 11950 2300 2    50   ~ 0
RELAY1
Text Label 11950 4550 2    50   ~ 0
RELAY2
Text Label 11950 6800 2    50   ~ 0
RELAY3
Text Label 11950 9050 2    50   ~ 0
RELAY4
Text Label 8050 9350 2    50   ~ 0
WIEGAND1
Text Label 8050 9200 2    50   ~ 0
WIEGAND0
Connection ~ 4950 2050
Wire Wire Line
	4950 2050 5450 2050
Wire Wire Line
	5450 2050 6500 2050
$EndSCHEMATC
