import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3006'; // URL pour l'émulateur Android vers localhost

  Future<bool> uploadEvidence(String missionId, File photo, File signature, String status) async {
    try {
      var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/missions/$missionId/evidence'));
      
      request.fields['status'] = status;
      
      request.files.add(await http.MultipartFile.fromPath(
        'file', 
        photo.path,
        filename: 'photo_pod.jpg'
      ));

      // Note: In a real app we might upload signature separately or combine,
      // here we follow the backend logic of one file per evidence call or we can update our backend
      // For now, let's assume we send the photo as the main POD evidence.
      
      var response = await request.send();
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Upload Error: $e');
      return false;
    }
  }

  Future<List<dynamic>> getMyMissions() async {
    final response = await http.get(Uri.parse('$baseUrl/missions'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    return [];
  }
}
