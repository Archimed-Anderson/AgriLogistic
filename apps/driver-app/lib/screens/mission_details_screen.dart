import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'pod_capture_screen.dart';

void main() {
  runApp(const AgroDeepDriverApp());
}

class AgroDeepDriverApp extends StatelessWidget {
  const AgroDeepDriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AgroDeep Driver',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF020408),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5),
          brightness: Brightness.dark,
        ),
      ),
      home: const MissionDetailScreen(),
    );
  }
}

class MissionDetailScreen extends StatelessWidget {
  const MissionDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildMissionSummary(),
                  const SizedBox(height: 32),
                  _buildCheckpointStepper(),
                  const SizedBox(height: 40),
                  _buildActionPanel(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      backgroundColor: const Color(0xFF020408),
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          'MISSION #MS-9001',
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w900,
            fontSize: 20,
            fontStyle: FontStyle.italic,
          ),
        ),
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                const Color(0xFF4F46E5).withOpacity(0.3),
                Colors.transparent,
              ],
            ),
          ),
          child: const Center(
            child: Icon(Icons.location_on, size: 60, color: Color(0xFF4F46E5)),
          ),
        ),
      ),
    );
  }

  Widget _buildMissionSummary() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          _buildRouteRow('Ferme Korbogho', 'Origine / Pickup'),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(color: Colors.white10),
          ),
          _buildRouteRow('Port Abidjan', 'Destination'),
        ],
      ),
    );
  }

  Widget _buildRouteRow(String name, String label) {
    return Row(
      children: [
        Icon(Icons.radio_button_checked, size: 16, color: name.contains('Port') ? Colors.indigo : Colors.emerald),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
            Text(name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          ],
        ),
      ],
    );
  }

  Widget _buildCheckpointStepper() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('WORKFLOW DE LIVRAISON', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.grey)),
        const SizedBox(height: 24),
        _buildStep('COLLECTE EFFECTUÉE', '08:45 AM', true),
        _buildStep('PESÉE VALIDÉE', '09:15 AM', true),
        _buildStep('EN TRANSIT', 'LIVE', true, isActive: true),
        _buildStep('LIVRAISON & SIGNATURE', 'ATTENTE', false),
      ],
    );
  }

  Widget _buildStep(String title, String time, bool isDone, {bool isActive = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isDone ? const Color(0xFF4F46E5) : Colors.transparent,
              shape: BoxShape.circle,
              border: Border.all(color: isDone ? const Color(0xFF4F46E5) : Colors.white10),
            ),
            child: isDone ? const Icon(Icons.check, size: 16, color: Colors.white) : null,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.w900, color: isDone ? Colors.white : Colors.grey)),
                Text(time, style: const TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ),
          if (isActive)
            const Icon(Icons.sensors, color: Colors.indigo, size: 20),
        ],
      ),
    );
  }

  Widget _buildActionPanel() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF4F46E5),
        borderRadius: BorderRadius.circular(40),
        boxShadow: [
          BoxShadow(color: const Color(0xFF4F46E5).withOpacity(0.3), blurRadius: 30, offset: const Offset(0, 10)),
        ],
      ),
      child: Column(
        children: [
          const Icon(Icons.camera_alt_outlined, size: 40, color: Colors.white),
          const SizedBox(height: 16),
          const Text('VALIDER ÉTAPE SUIVANTE', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
          const SizedBox(height: 8),
          const Text('PHOTO POD + SIGNATURE REQUISE', style: TextStyle(fontSize: 10, color: Colors.white70)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const PodCaptureScreen(missionId: 'MS-9001'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
              minimumSize: const Size(double.infinity, 60),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
            child: const Text('OUVRIR APPAREIL PHOTO', style: TextStyle(fontWeight: FontWeight.w900)),
          ),
        ],
      ),
    );
  }
}
