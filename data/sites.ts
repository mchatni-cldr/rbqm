import { Site, KriValue, KriId } from '@/lib/types'
import { computeCompositeRiskScore, riskTierFromScore } from '@/lib/utils'
import { kriValuesStudy001, kriValuesStudy002, kriValuesStudy003 } from './kri-values'

function buildSite(
  id: string,
  studyId: string,
  name: string,
  country: string,
  countryCode: string,
  coordinates: [number, number],
  kriValuesRaw: Record<string, KriValue>,
  enrolledSubjects: number,
  targetSubjects: number,
  principalInvestigator: string,
  lastMonitoringVisit: string,
  siteActivationDate: string,
  openSignals: number
): Site {
  const kriValues = kriValuesRaw as Record<KriId, KriValue>
  const score = computeCompositeRiskScore(kriValues)
  const riskTier = riskTierFromScore(score)

  return {
    id,
    studyId,
    name,
    country,
    countryCode,
    coordinates,
    compositeRiskScore: score,
    riskTier,
    kriValues,
    openSignals,
    enrolledSubjects,
    targetSubjects,
    principalInvestigator,
    lastMonitoringVisit,
    siteActivationDate,
  }
}

// ─── STUDY-001 sites ──────────────────────────────────────────────────────────
const study001Sites: Site[] = [
  buildSite('SITE-001-01', 'STUDY-001', 'Mass General Cancer Center', 'United States', 'US', [-71.068, 42.363], kriValuesStudy001['SITE-001-01'], 6, 6, 'Dr. Sarah Chen', '2026-02-15', '2025-03-10', 0),
  buildSite('SITE-001-02', 'STUDY-001', 'Johns Hopkins Oncology', 'United States', 'US', [-76.624, 39.296], kriValuesStudy001['SITE-001-02'], 5, 7, 'Dr. Michael Torres', '2026-01-28', '2025-03-15', 2),
  buildSite('SITE-001-03', 'STUDY-001', 'Royal Marsden Hospital', 'United Kingdom', 'UK', [-0.185, 51.486], kriValuesStudy001['SITE-001-03'], 5, 6, 'Prof. James Hartley', '2026-02-10', '2025-04-01', 0),
  buildSite('SITE-001-04', 'STUDY-001', 'Heidelberg University Hospital', 'Germany', 'DE', [8.675, 49.416], kriValuesStudy001['SITE-001-04'], 3, 7, 'Dr. Klaus Weber', '2025-12-20', '2025-04-15', 3),
  buildSite('SITE-001-05', 'STUDY-001', 'UCLA Jonsson Cancer Center', 'United States', 'US', [-118.397, 34.066], kriValuesStudy001['SITE-001-05'], 6, 7, 'Dr. Amanda Walsh', '2026-02-20', '2025-03-10', 0),
  buildSite('SITE-001-06', 'STUDY-001', 'Peter MacCallum Cancer Centre', 'Australia', 'AU', [144.970, -37.810], kriValuesStudy001['SITE-001-06'], 4, 7, 'Dr. Lena Zhao', '2026-01-15', '2025-05-01', 1),
  buildSite('SITE-001-07', 'STUDY-001', 'MD Anderson Cancer Center', 'United States', 'US', [-95.394, 29.706], kriValuesStudy001['SITE-001-07'], 5, 5, 'Dr. Robert Kim', '2026-02-25', '2025-03-10', 0),
  buildSite('SITE-001-08', 'STUDY-001', 'Charité – Universitätsmedizin', 'Germany', 'DE', [13.374, 52.516], kriValuesStudy001['SITE-001-08'], 5, 8, 'Dr. Petra Müller', '2026-01-30', '2025-04-20', 1),
]

// ─── STUDY-002 sites ──────────────────────────────────────────────────────────
const study002Sites: Site[] = [
  buildSite('SITE-002-01', 'STUDY-002', 'Cleveland Cardiac Institute', 'United States', 'US', [-81.695, 41.499], kriValuesStudy002['SITE-002-01'], 7, 24, 'Dr. Daniel Foster', '2025-12-10', '2024-10-01', 5),
  buildSite('SITE-002-02', 'STUDY-002', 'São Paulo Heart Hospital', 'Brazil', 'BR', [-46.634, -23.548], kriValuesStudy002['SITE-002-02'], 8, 22, 'Dr. Ana Costa', '2025-11-25', '2024-10-15', 4),
  buildSite('SITE-002-03', 'STUDY-002', 'Amsterdam UMC Cardiology', 'Netherlands', 'NL', [4.900, 52.335], kriValuesStudy002['SITE-002-03'], 11, 20, 'Prof. Erik van den Berg', '2026-01-20', '2024-11-01', 2),
  buildSite('SITE-002-04', 'STUDY-002', 'UCSF Medical Center', 'United States', 'US', [-122.457, 37.762], kriValuesStudy002['SITE-002-04'], 14, 18, 'Dr. Patricia Lee', '2026-02-18', '2024-10-01', 0),
  buildSite('SITE-002-05', 'STUDY-002', 'Hôpital Lariboisière', 'France', 'FR', [2.350, 48.882], kriValuesStudy002['SITE-002-05'], 10, 22, 'Dr. François Martin', '2026-01-12', '2024-11-15', 3),
  buildSite('SITE-002-06', 'STUDY-002', 'Cleveland Clinic Main Campus', 'United States', 'US', [-81.620, 41.503], kriValuesStudy002['SITE-002-06'], 13, 18, 'Dr. Brian Johnson', '2026-02-10', '2024-10-01', 0),
  buildSite('SITE-002-07', 'STUDY-002', 'St. Bartholomew\'s Hospital', 'United Kingdom', 'UK', [-0.100, 51.517], kriValuesStudy002['SITE-002-07'], 11, 20, 'Prof. Helen Carter', '2026-01-28', '2024-11-01', 1),
  buildSite('SITE-002-08', 'STUDY-002', 'Toronto General Hospital', 'Canada', 'CA', [-79.391, 43.659], kriValuesStudy002['SITE-002-08'], 12, 20, 'Dr. Kevin O\'Brien', '2026-02-15', '2024-10-15', 0),
  buildSite('SITE-002-09', 'STUDY-002', 'Hospital Clinic Barcelona', 'Spain', 'ES', [2.152, 41.388], kriValuesStudy002['SITE-002-09'], 10, 20, 'Dr. Maria Garcia', '2026-01-22', '2024-11-15', 2),
  buildSite('SITE-002-10', 'STUDY-002', 'Mayo Clinic Rochester', 'United States', 'US', [-92.467, 44.022], kriValuesStudy002['SITE-002-10'], 14, 16, 'Dr. Steven Rogers', '2026-02-22', '2024-10-01', 0),
  buildSite('SITE-002-11', 'STUDY-002', 'Karolinska University Hospital', 'Netherlands', 'NL', [18.034, 59.281], kriValuesStudy002['SITE-002-11'], 13, 18, 'Dr. Ingrid Larsson', '2026-02-08', '2024-11-01', 0),
  buildSite('SITE-002-12', 'STUDY-002', 'Hôpital Bichat Paris', 'France', 'FR', [2.329, 48.896], kriValuesStudy002['SITE-002-12'], 11, 20, 'Dr. Pierre Dubois', '2026-01-18', '2024-11-15', 1),
  buildSite('SITE-002-13', 'STUDY-002', 'Mount Sinai Heart', 'United States', 'US', [-73.952, 40.791], kriValuesStudy002['SITE-002-13'], 13, 16, 'Dr. Rachel Goldman', '2026-02-20', '2024-10-01', 0),
  buildSite('SITE-002-14', 'STUDY-002', 'Bristol Heart Institute', 'United Kingdom', 'UK', [-2.600, 51.454], kriValuesStudy002['SITE-002-14'], 12, 18, 'Dr. Andrew Patel', '2026-02-05', '2024-11-01', 0),
  buildSite('SITE-002-15', 'STUDY-002', 'Hospital de la Santa Creu', 'Spain', 'ES', [2.183, 41.378], kriValuesStudy002['SITE-002-15'], 9, 22, 'Dr. Carlos Rodriguez', '2025-12-28', '2024-11-15', 2),
  buildSite('SITE-002-16', 'STUDY-002', 'McGill University Health Centre', 'Canada', 'CA', [-73.586, 45.474], kriValuesStudy002['SITE-002-16'], 13, 16, 'Dr. Sophie Tremblay', '2026-02-18', '2024-10-15', 0),
  buildSite('SITE-002-17', 'STUDY-002', 'Münchner Herzklinik', 'Germany', 'DE', [11.576, 48.137], kriValuesStudy002['SITE-002-17'], 10, 20, 'Dr. Hans Schneider', '2026-01-25', '2024-11-01', 1),
  buildSite('SITE-002-18', 'STUDY-002', 'Instituto de Cardiologia SP', 'Brazil', 'BR', [-46.651, -23.558], kriValuesStudy002['SITE-002-18'], 11, 20, 'Dr. Bruno Silva', '2026-02-12', '2024-10-15', 0),
]

// ─── STUDY-003 sites ──────────────────────────────────────────────────────────
const study003Sites: Site[] = [
  buildSite('SITE-003-01', 'STUDY-003', 'Delhi Neuro & Psychiatry Institute', 'India', 'IN', [77.209, 28.614], kriValuesStudy003['SITE-003-01'], 8, 24, 'Dr. Priya Sharma', '2025-12-15', '2024-07-01', 3),
  buildSite('SITE-003-02', 'STUDY-003', 'Keio University Hospital', 'Japan', 'JP', [139.718, 35.663], kriValuesStudy003['SITE-003-02'], 16, 22, 'Dr. Yuki Tanaka', '2026-02-20', '2024-07-15', 0),
  buildSite('SITE-003-03', 'STUDY-003', 'Northwestern Medicine', 'United States', 'US', [-87.634, 41.895], kriValuesStudy003['SITE-003-03'], 14, 24, 'Dr. Lisa Murray', '2026-01-25', '2024-07-01', 2),
  buildSite('SITE-003-04', 'STUDY-003', 'Seoul National University Hospital', 'South Korea', 'KR', [126.999, 37.579], kriValuesStudy003['SITE-003-04'], 18, 22, 'Prof. Ji-Hoon Park', '2026-02-22', '2024-08-01', 0),
  buildSite('SITE-003-05', 'STUDY-003', 'Maudsley Hospital', 'United Kingdom', 'UK', [-0.087, 51.469], kriValuesStudy003['SITE-003-05'], 15, 22, 'Dr. Fiona Williams', '2026-02-10', '2024-07-15', 0),
  buildSite('SITE-003-06', 'STUDY-003', 'Hospital Valdecilla', 'Spain', 'ES', [-3.815, 43.461], kriValuesStudy003['SITE-003-06'], 11, 24, 'Dr. Pablo Hernandez', '2026-01-18', '2024-08-15', 2),
  buildSite('SITE-003-07', 'STUDY-003', 'Yale New Haven Psychiatric', 'United States', 'US', [-72.921, 41.308], kriValuesStudy003['SITE-003-07'], 19, 20, 'Dr. Thomas Chen', '2026-02-25', '2024-07-01', 0),
  buildSite('SITE-003-08', 'STUDY-003', 'University of Warsaw Clinic', 'Poland', 'PL', [21.012, 52.230], kriValuesStudy003['SITE-003-08'], 14, 20, 'Dr. Agnieszka Kowalski', '2026-02-08', '2024-08-01', 0),
  buildSite('SITE-003-09', 'STUDY-003', 'UT Southwestern Psychiatry', 'United States', 'US', [-96.786, 32.813], kriValuesStudy003['SITE-003-09'], 13, 22, 'Dr. Jennifer Cox', '2026-01-30', '2024-07-01', 1),
  buildSite('SITE-003-10', 'STUDY-003', 'Osaka University Hospital', 'Japan', 'JP', [135.524, 34.821], kriValuesStudy003['SITE-003-10'], 17, 20, 'Dr. Hiroshi Yamamoto', '2026-02-18', '2024-07-15', 0),
  buildSite('SITE-003-11', 'STUDY-003', 'Cracow Psychiatry Institute', 'Poland', 'PL', [19.945, 50.065], kriValuesStudy003['SITE-003-11'], 12, 22, 'Dr. Marek Wiśniewski', '2026-01-22', '2024-08-15', 1),
  buildSite('SITE-003-12', 'STUDY-003', 'Yonsei University Severance', 'South Korea', 'KR', [126.941, 37.562], kriValuesStudy003['SITE-003-12'], 15, 20, 'Dr. Min-Soo Kim', '2026-02-12', '2024-08-01', 0),
  buildSite('SITE-003-13', 'STUDY-003', 'University of Michigan Psych', 'United States', 'US', [-83.736, 42.280], kriValuesStudy003['SITE-003-13'], 18, 22, 'Dr. Natalie Brooks', '2026-02-22', '2024-07-01', 0),
  buildSite('SITE-003-14', 'STUDY-003', 'Buenos Aires NeuroScience', 'Argentina', 'AR', [-58.381, -34.604], kriValuesStudy003['SITE-003-14'], 14, 22, 'Dr. Valentina Gomez', '2026-01-28', '2024-08-15', 1),
  buildSite('SITE-003-15', 'STUDY-003', 'Mumbai Psychiatric Hospital', 'India', 'IN', [72.877, 19.076], kriValuesStudy003['SITE-003-15'], 10, 24, 'Dr. Rahul Mehta', '2025-12-20', '2024-08-01', 2),
  buildSite('SITE-003-16', 'STUDY-003', 'Kyoto University Hospital', 'Japan', 'JP', [135.765, 35.015], kriValuesStudy003['SITE-003-16'], 16, 20, 'Dr. Akiko Suzuki', '2026-02-15', '2024-07-15', 0),
  buildSite('SITE-003-17', 'STUDY-003', 'Columbia Psychiatry', 'United States', 'US', [-73.942, 40.841], kriValuesStudy003['SITE-003-17'], 15, 22, 'Dr. Marcus Hayes', '2026-02-10', '2024-07-01', 0),
  buildSite('SITE-003-18', 'STUDY-003', 'Buenos Aires Central', 'Argentina', 'AR', [-58.421, -34.618], kriValuesStudy003['SITE-003-18'], 13, 24, 'Dr. Diego Fernandez', '2026-01-20', '2024-08-15', 1),
  buildSite('SITE-003-19', 'STUDY-003', 'Stanford Psychiatry Center', 'United States', 'US', [-122.167, 37.434], kriValuesStudy003['SITE-003-19'], 18, 20, 'Dr. Emily Zhang', '2026-02-25', '2024-07-01', 0),
  buildSite('SITE-003-20', 'STUDY-003', 'Samsung Medical Center', 'South Korea', 'KR', [127.085, 37.488], kriValuesStudy003['SITE-003-20'], 15, 20, 'Dr. Soo-Yeon Lee', '2026-02-18', '2024-08-01', 0),
  buildSite('SITE-003-21', 'STUDY-003', 'Asan Medical Center', 'South Korea', 'KR', [127.110, 37.526], kriValuesStudy003['SITE-003-21'], 13, 22, 'Dr. Young-Jun Choi', '2026-01-25', '2024-08-01', 1),
  buildSite('SITE-003-22', 'STUDY-003', 'Auckland City Hospital', 'Australia', 'AU', [174.769, -36.867], kriValuesStudy003['SITE-003-22'], 14, 20, 'Dr. Catherine Wilson', '2026-02-12', '2024-08-15', 0),
]

export const sites: Site[] = [...study001Sites, ...study002Sites, ...study003Sites]

export function getSitesByStudy(studyId: string): Site[] {
  return sites.filter(s => s.studyId === studyId)
}

export function getSiteById(siteId: string): Site | undefined {
  return sites.find(s => s.id === siteId)
}
