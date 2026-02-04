import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:signature/signature.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:path_provider/path_provider.dart';
import '../services/api_service.dart';

class PodCaptureScreen extends StatefulWidget {
  final String missionId;
  const PodCaptureScreen({super.key, required this.missionId});

  @override
  State<PodCaptureScreen> createState() => _PodCaptureScreenState();
}

class _PodCaptureScreenState extends State<PodCaptureScreen> {
  File? _photo;
  final SignatureController _signatureController = SignatureController(
    penStrokeWidth: 3,
    penColor: Colors.white,
    exportBackgroundColor: Colors.black,
  );
  bool _isUploading = false;
  final ApiService _apiService = ApiService();

  Future<void> _takePhoto() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.camera, imageQuality: 70);
    
    if (image != null) {
      setState(() {
        _photo = File(image.path);
      });
    }
  }

  Future<void> _submitPod() async {
    if (_photo == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez prendre une photo du bon de livraison')),
      );
      return;
    }

    if (_signatureController.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('La signature du réceptionnaire est requise')),
      );
      return;
    }

    setState(() => _isUploading = true);

    try {
      // Export signature as file
      final Uint8List? signatureData = await _signatureController.toPngBytes();
      final tempDir = await getTemporaryDirectory();
      final signatureFile = File('${tempDir.path}/signature.png');
      await signatureFile.writeAsBytes(signatureData!);

      final success = await _apiService.uploadEvidence(
        widget.missionId, 
        _photo!, 
        signatureFile, 
        'DELIVERED'
      );

      if (success && mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => AlertDialog(
            backgroundColor: const Color(0xFF0F172A),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            title: const Icon(Icons.check_circle, color: Colors.emerald, size: 64),
            content: Text(
              'LIVRAISON VALIDÉE !\nLa mission est clôturée avec succès.',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
                child: const Text('RETOUR AU DASHBOARD', style: TextStyle(color: Colors.indigo)),
              )
            ],
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: $e')),
      );
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020408),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('PREUVE DE LIVRAISON', style: GoogleFonts.outfit(fontWeight: FontWeight.black, fontSize: 16)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader('1. PHOTO DU CMR / MARCHANDISE'),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: _takePhoto,
              child: Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white10),
                ),
                child: _photo != null 
                  ? ClipRRect(borderRadius: BorderRadius.circular(24), child: Image.file(_photo!, fit: BoxFit.cover))
                  : const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.camera_enhance_outlined, size: 40, color: Colors.indigo),
                        SizedBox(height: 12),
                        Text('TAPPER POUR PRENDRE PHOTO', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                      ],
                    ),
              ),
            ),
            const SizedBox(height: 32),
            _buildSectionHeader('2. SIGNATURE DU RÉCEPTIONNAIRE'),
            const SizedBox(height: 16),
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.03),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white10),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Signature(
                  controller: _signatureController,
                  backgroundColor: Colors.transparent,
                ),
              ),
            ),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: () => _signatureController.clear(),
                child: const Text('EFFACER SIGNATURE', style: TextStyle(color: Colors.redAccent, fontSize: 10)),
              ),
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 64,
              child: ElevatedButton(
                onPressed: _isUploading ? null : _submitPod,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4F46E5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: _isUploading 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('CONFIRMER LA LIVRAISON', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: Colors.indigo, letterSpacing: 1.2),
    );
  }
}
