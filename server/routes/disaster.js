import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const leagleDisasterTypes = [
    'Epidemic',
    'Drought',
    'Flood',
    'Extreme temperature',
    'Volcanic activity',
    'Storm',
    'Wildfire',
    'Earthquake'
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
        if (view !== 'economic' && view !== 'population' && view !== 'none') {
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
            jsonData = jsonData.filter(item => disasterTypes.includes(item.d));
        }

        // 筛选 yearRange
        if (Array.isArray(yearRange) && yearRange.length === 2) {
            const [minYear, maxYear] = yearRange;
            jsonData = jsonData.filter(item => item.t >= minYear && item.t <= maxYear);
        }

        // 筛选 view
        if (view === 'economic') {
            jsonData = jsonData
                .filter(item => item.e != null && item.e !== 0)
                .map(item => ({ ...item, r: item.el }));
        } else if (view === 'population') {
            jsonData = jsonData
                .filter(item => item.p != null && item.p !== 0)
                .map(item => ({ ...item, r: item.pl }));
        }
        res.json({
            code: 200,
            msg: 'success',
            data: jsonData,
        });
    });
});

router.get('/getDisasterDetail', (req, res) => {
    const disasterId = req.query.id;
    if (!disasterId) {
        return res.status(200).json({
            code: 400,
            msg: 'Invalid request parameters',
        });
    }
    const filePath = path.join(process.cwd(), 'server', 'data', 'detail_data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 500,
                msg: 'database exception',
                err: 'file read error',
            });
        }
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (e) {
            return res.status(200).json({
                code: 500,
                msg: 'database exception',
                err: 'JSON parse error',
            });
        }
        // 查找第一个 id 匹配的数据
        const detail = jsonData.find(item => String(item.id) === String(disasterId));
        if (!detail) {
            return res.status(200).json({
                code: 404,
                msg: 'not found',
            });
        }
        res.json({
            code: 200,
            msg: 'success',
            data: detail,
        });
    });
});

export default router;
