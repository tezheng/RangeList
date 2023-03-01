
import fs from 'fs';
import https from 'https';

const summaryPath = 'coverage/coverage-summary.json';
const badgeInfoPath = 'coverage/badge-info.json';
const badgePath = 'coverage/coverage-badge.svg';

function generateBadgeInfo() {
  const badgeInfo = {
    schemaVersion: 1,
    label: 'Coverage',
    namedLogo: 'jest',
  };
  
  const unknown = {
    ...badgeInfo,
    color: 'lightgrey',
    message: 'unknown',
  };

  // Check if file exists
  if (!fs.existsSync(summaryPath)) {
    console.log('Coverage summary does not exist');
    return unknown;
  }

  // Load file and parse as JSON object
  const fileData = fs.readFileSync(summaryPath);
  const jsonFileData = JSON.parse(fileData);

  // Get total.lines.pct
  try {
    const percentage = jsonFileData.total.lines.pct;
    const color = ((val) => {
      if (val >= 90) {
        return 'brightgreen';
      }
      if (val >= 80) {
        return 'green';
      }
      if (val >= 60) {
        return 'yellow';
      }
      if (val >= 40) {
        return 'orange';
      }
      return 'red';
    })(percentage);
    return {
      ...badgeInfo,
      color,
      message: `${percentage}%`,
    };
  } catch {
    return unknown;
  }
}

function saveBadgeInfo(info) {
  fs.writeFile(badgeInfoPath, JSON.stringify(info, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  
    console.log(`Badge info saved to ${badgeInfoPath}`);
  });
}

function saveBadgeToDisk(badgeInfo) {
  const { label, message, color } = badgeInfo;
  const url = `https://img.shields.io/badge/${label}-${message}-${color}`;

  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Request failed with status code ${res.statusCode}`);
      return;
    }

    const fileStream = fs.createWriteStream(badgePath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log(`Coverage badge saved to ${badgePath}`);
    });
  }).on('error', (err) => {
    console.error(`Error when accessing img.shields.io: ${err.message}`);
  });
}

// Generate coverage badge info and badge svg
const badgeInfo = generateBadgeInfo();
console.log('Badge info: ', badgeInfo);

saveBadgeInfo(badgeInfo);
saveBadgeToDisk(badgeInfo);
