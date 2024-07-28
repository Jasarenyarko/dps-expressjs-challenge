import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

const dir = path.join(__dirname, '../../storage/logs');
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir, { recursive: true });
}
const accessLogStream = fs.createWriteStream(`${dir}/access.log`, {
	flags: 'a',
});

export default morgan('combined', { stream: accessLogStream });
