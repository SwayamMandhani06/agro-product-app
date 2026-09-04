// ============================================================
// AGRITRADE SPENDING TREND CHART (FLUTTER)
// CustomPainter vector financial area/line graph for mobile widths
// ============================================================

import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../domain/analytics_metrics.dart';

class SpendingChartWidget extends StatelessWidget {
  final List<SpendingTrendDataPoint> dataPoints;
  final double height;

  const SpendingChartWidget({
    super.key,
    required this.dataPoints,
    this.height = 160.0,
  });

  @override
  Widget build(BuildContext context) {
    if (dataPoints.isEmpty) {
      return SizedBox(
        height: height,
        child: const Center(
          child: Text(
            'No spending data for this period',
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ),
      );
    }

    return SizedBox(
      height: height,
      width: double.infinity,
      child: CustomPaint(
        painter: _SpendingChartPainter(dataPoints: dataPoints),
      ),
    );
  }
}

class _SpendingChartPainter extends CustomPainter {
  final List<SpendingTrendDataPoint> dataPoints;

  _SpendingChartPainter({required this.dataPoints});

  @override
  void paint(Canvas canvas, Size size) {
    const padLeft = 16.0;
    const padRight = 16.0;
    const padTop = 14.0;
    const padBottom = 26.0;

    final chartW = size.width - padLeft - padRight;
    final chartH = size.height - padTop - padBottom;

    final maxVal = math.max(
      dataPoints.map((d) => d.amount).reduce(math.max),
      1000.0,
    );
    final ceiling = (maxVal * 1.15 / 1000.0).ceil() * 1000.0;

    // 1. Draw horizontal subtle dashed gridlines (3 lines)
    final gridPaint = Paint()
      ..color = const Color(0xFFE5E7EB)
      ..strokeWidth = 1.0;

    for (int i = 0; i <= 2; i++) {
      final y = padTop + chartH * (i / 2.0);
      canvas.drawLine(
        Offset(padLeft, y),
        Offset(size.width - padRight, y),
        gridPaint,
      );
    }

    // Coordinate mapping
    double getX(int idx) {
      if (dataPoints.length <= 1) return padLeft + chartW / 2.0;
      return padLeft + (idx / (dataPoints.length - 1)) * chartW;
    }

    double getY(double val) {
      final ratio = (val / ceiling).clamp(0.0, 1.0);
      return padTop + chartH - (ratio * chartH);
    }

    final path = Path();
    final areaPath = Path();

    path.moveTo(getX(0), getY(dataPoints[0].amount));
    areaPath.moveTo(getX(0), padTop + chartH);
    areaPath.lineTo(getX(0), getY(dataPoints[0].amount));

    for (int i = 1; i < dataPoints.length; i++) {
      final x = getX(i);
      final y = getY(dataPoints[i].amount);
      path.lineTo(x, y);
      areaPath.lineTo(x, y);
    }

    areaPath.lineTo(getX(dataPoints.length - 1), padTop + chartH);
    areaPath.close();

    // 2. Area fill
    final areaPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Color(0x280B3D2E), // 16% Forest Green
          Color(0x000B3D2E), // 0%
        ],
      ).createShader(Rect.fromLTWH(0, padTop, size.width, chartH));

    canvas.drawPath(areaPath, areaPaint);

    // 3. Stroke Line
    final linePaint = Paint()
      ..color = const Color(0xFF0B3D2E)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(path, linePaint);

    // 4. Draw data points and X-axis labels
    final dotFillPaint = Paint()..color = Colors.white;
    final dotStrokePaint = Paint()
      ..color = const Color(0xFF0B3D2E)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    const textStyle = TextStyle(
      fontSize: 10.0,
      fontWeight: FontWeight.w500,
      color: Color(0xFF78716C),
    );

    for (int i = 0; i < dataPoints.length; i++) {
      final cx = getX(i);
      final cy = getY(dataPoints[i].amount);

      // Dot
      canvas.drawCircle(Offset(cx, cy), 3.5, dotFillPaint);
      canvas.drawCircle(Offset(cx, cy), 3.5, dotStrokePaint);

      // Label below
      final textSpan = TextSpan(text: dataPoints[i].label, style: textStyle);
      final tp = TextPainter(
        text: textSpan,
        textAlign: TextAlign.center,
        textDirection: TextDirection.ltr,
      )..layout();

      tp.paint(canvas, Offset(cx - tp.width / 2.0, size.height - tp.height));
    }
  }

  @override
  bool shouldRepaint(covariant _SpendingChartPainter oldDelegate) {
    return oldDelegate.dataPoints != dataPoints;
  }
}
