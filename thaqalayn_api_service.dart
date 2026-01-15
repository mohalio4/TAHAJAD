// lib/services/thaqalayn_api_service.dart
import 'dart:convert';

import 'package:http/http.dart' as http;
import '../dataBases/models/thaqalayn_models.dart';

class ThaqalaynApiService {
  static const String _baseUrl = 'https://www.thaqalayn-api.net/api/v2';

  final http.Client _client;

  ThaqalaynApiService({http.Client? client}) : _client = client ?? http.Client();

  /// GET /api/v2/allbooks
  Future<List<Book>> getAllBooks() async {
    final uri = Uri.parse('$_baseUrl/allbooks');
    final res = await _client.get(uri);
    if (res.statusCode != 200) {
      throw Exception('Failed to load books: ${res.statusCode}');
    }
    return Book.listFromJson(res.body);
  }

  /// GET /api/v2/random or /api/v2/{bookId}/random
  /// bookId is now a String slug (e.g. "Al-Amali-Mufid")
  Future<Hadith> getRandomHadith({String? bookId}) async {
    final path = (bookId == null) ? 'random' : '$bookId/random';
    final uri = Uri.parse('$_baseUrl/$path');
    final res = await _client.get(uri);
    if (res.statusCode != 200) {
      throw Exception('Failed to load random hadith: ${res.statusCode}');
    }
    final decoded = jsonDecode(res.body);
    if (decoded is Map<String, dynamic>) {
      return Hadith.fromJson(decoded);
    } else if (decoded is List && decoded.isNotEmpty) {
      return Hadith.fromJson(decoded.first as Map<String, dynamic>);
    }
    throw Exception('Unexpected random hadith response');
  }

  /// GET /api/v2/query?q={query}
  Future<List<Hadith>> searchAllBooks(String query) async {
    final uri = Uri.parse('$_baseUrl/query').replace(queryParameters: {
      'q': query,
    });
    final res = await _client.get(uri);
    if (res.statusCode != 200) {
      throw Exception('Failed to search hadiths: ${res.statusCode}');
    }
    return Hadith.listFromJson(res.body);
  }

  /// GET /api/v2/query/{bookId}?q={query}
  Future<List<Hadith>> searchInBook(String bookId, String query) async {
    final uri = Uri.parse('$_baseUrl/query/$bookId')
        .replace(queryParameters: {'q': query});
    final res = await _client.get(uri);
    if (res.statusCode != 200) {
      throw Exception('Failed to search hadiths in book: ${res.statusCode}');
    }
    return Hadith.listFromJson(res.body);
  }

  /// GET /api/v2/{bookId}
  Future<List<Hadith>> getAllHadithOfBook(String bookId) async {
    final uri = Uri.parse('$_baseUrl/$bookId');
    final res = await _client.get(uri);
    if (res.statusCode != 200) {
      throw Exception('Failed to load hadiths for book: ${res.statusCode}');
    }
    return Hadith.listFromJson(res.body);
  }

  /// GET /api/v2/{bookId}/{id}
  Future<Hadith> getSpecificHadith(String bookId, int id) async {
    final uri = Uri.parse('$_baseUrl/$bookId/$id');
    final res = await _client.get(uri);
    if (res.statusCode != 200) {
      throw Exception('Failed to load specific hadith: ${res.statusCode}');
    }
    final decoded = jsonDecode(res.body);
    if (decoded is Map<String, dynamic>) {
      return Hadith.fromJson(decoded);
    }
    throw Exception('Unexpected specific hadith response');
  }

  void dispose() {
    _client.close();
  }
}
