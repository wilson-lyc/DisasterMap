import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const leagleDisasterTypes = [
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
]

router.post('/getDisasterData', (req, res) => {
    const filePath = path.join(process.cwd(), 'server', 'data', 'data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 500,
                msg: 'database exception',
            });
        }

        // 获取灾难数据
        let jsonData = JSON.parse(data);

        // 获取请求参数
        const view = req.body.view || 'economic';
        const disasterTypes = req.body.disasterTypes || leagleDisasterTypes;
        const yearRange = req.body.yearRange || [2000, 2025];

        // 检查请求参数
        if (view !== 'economic' && view !== 'population') {
            return res.status(200).json({
                code: 400,
                msg: 'Invalid request parameters',
            });
        }

        if (!Array.isArray(disasterTypes) || disasterTypes.some(type => !leagleDisasterTypes.includes(type))) {
            return res.status(200).json({
                code: 400,
                msg: 'Invalid request parameters',
            });
        }

        if (!Array.isArray(yearRange) || yearRange.length !== 2) {
            return res.status(200).json({
                code: 400,
                msg: 'Invalid request parameters',
            });
        }
        const [minYearRaw, maxYearRaw] = yearRange;
        const minYear = Number(minYearRaw);
        const maxYear = Number(maxYearRaw);
        if (!Number.isInteger(minYear) || !Number.isInteger(maxYear) || minYear > maxYear || minYear < 2000 || maxYear > 2025) {
            return res.status(400).json({
                code: 400,
                msg: 'Invalid request parameters',
            });
        }

        // 筛选 disasterTypes
        if (Array.isArray(disasterTypes) && disasterTypes.length > 0) {
            jsonData = jsonData.filter(item => disasterTypes.includes(item.disaster_type));
        }

        // 筛选 yearRange
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
        res.json({
            code: 200,
            msg: 'success',
            data: jsonData,
        });
    });
});
export default router;
