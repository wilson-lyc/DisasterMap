import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/getData', (req, res) => {
    const filePath = path.join(process.cwd(), 'public', 'config', 'data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '无法读取数据文件', details: err.message });
        }
        let jsonData = JSON.parse(data);

        const view = req.query.view || 'economic';
        let disasterTypes = req.query['disasterTypes[]'] || [
            'Drought',
            'Flood',
            'Extreme temperature',
            'Volcanic activity',
            'Storm',
            'Wildfire',
            'Earthquake',
            'Epidemic',
            'Mass movement (wet)',
            'Infestation',
            'Mass movement (dry)',
            'Impact',
            'Animal incident',
            'Glacial lake outburst flood'
        ];
        if (typeof disasterTypes === 'string') {
            disasterTypes = [disasterTypes];
        }
        const yearRange = req.query['yearRange[]'] ? req.query['yearRange[]'].map(Number) : [2000, 2025];
        console.log('Received query parameters:', { view, disasterTypes, yearRange });

        // 筛选 disaster_type
        if (Array.isArray(disasterTypes) && disasterTypes.length > 0) {
            jsonData = jsonData.filter(item => disasterTypes.includes(item.disaster_type));
        }

        // 筛选 year_range
        if (Array.isArray(yearRange) && yearRange.length === 2) {
            const [minYear, maxYear] = yearRange;
            jsonData = jsonData.filter(item => item.start_year >= minYear && item.start_year <= maxYear);
        }

        // 筛选 view
        if (view === 'economic') {
            jsonData = jsonData
                .filter(item => item.economic_radius && item.economic_radius !== 0)
                .map(item => ({ ...item, radius: item.economic_radius }));
        } else {
            jsonData = jsonData
                .filter(item => item.population_radius && item.population_radius !== 0)
                .map(item => ({ ...item, radius: item.population_radius }));
        }
        res.json(jsonData);
    });
});
export default router;
