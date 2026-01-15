// lib/models/thaqalayn_models.dart
import 'dart:convert';

//
// ─────────────────────────────────────────────
//   BOOK MODEL  (Matches Thaqalayn API exactly)
// ─────────────────────────────────────────────
//
class Book {
  final String id; // bookId is a STRING slug, not int
  final String title;
  final String? englishName;
  final String? author;
  final int? idRangeMin;
  final int? idRangeMax;
  final String? description;
  final String? coverUrl;
  final String? translator;
  final int? volume;

  Book({
    required this.id,
    required this.title,
    this.englishName,
    this.author,
    this.idRangeMin,
    this.idRangeMax,
    this.description,
    this.coverUrl,
    this.translator,
    this.volume,
  });

  factory Book.fromJson(Map<String, dynamic> json) {
    return Book(
      id: json['bookId']?.toString() ?? '',
      title: json['BookName']?.toString() ?? '',
      englishName: json['englishName']?.toString(),
      author: json['author']?.toString(),
      idRangeMin: (json['idRangeMin'] as num?)?.toInt(),
      idRangeMax: (json['idRangeMax'] as num?)?.toInt(),
      description: json['bookDescription']?.toString(),
      coverUrl: json['bookCover']?.toString(),
      translator: json['translator']?.toString(),
      volume: (json['volume'] as num?)?.toInt(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bookId': id,
      'BookName': title,
      if (englishName != null) 'englishName': englishName,
      if (author != null) 'author': author,
      if (idRangeMin != null) 'idRangeMin': idRangeMin,
      if (idRangeMax != null) 'idRangeMax': idRangeMax,
      if (description != null) 'bookDescription': description,
      if (coverUrl != null) 'bookCover': coverUrl,
      if (translator != null) 'translator': translator,
      if (volume != null) 'volume': volume,
    };
  }

  static List<Book> listFromJson(String body) {
    final decoded = jsonDecode(body);

    if (decoded is List) {
      return decoded
          .map((e) => Book.fromJson(e as Map<String, dynamic>))
          .toList();
    }

    throw Exception("Unexpected books JSON: $decoded");
  }
}

//
// ─────────────────────────────────────────────
//   HADITH MODEL (Matches Thaqalayn API)
// ─────────────────────────────────────────────
//
class Hadith {
  final int id;
  final String bookId;      // book slug string, e.g. "Al-Amali-Mufid"
  final String? bookName;   // اسم الكتاب من الـ API (field: "book")
  final String? chapter;
  final String? title;
  final String? arabic;
  final String? english;
  final String? narrator;
  final String? grade;
  final String? reference;  // سنخزن فيها URL (الرابط)
  final int? volume;

  Hadith({
    required this.id,
    required this.bookId,
    this.bookName,
    this.chapter,
    this.title,
    this.arabic,
    this.english,
    this.narrator,
    this.grade,
    this.reference,
    this.volume,
  });

  Map<String, dynamic> toJson() {
    return {
      'hadithId': id,
      'bookId': bookId,
      if (bookName != null) 'book': bookName,
      if (chapter != null) 'chapterTitle': chapter,
      if (title != null) 'title': title,
      if (arabic != null) 'arabicText': arabic,
      if (english != null) 'englishText': english,
      if (narrator != null) 'narrator': narrator,
      if (grade != null) 'grade': grade,   // our own merged grade
      if (reference != null) 'URL': reference, // نعيد تخزين الرابط في نفس الحقل
      if (volume != null) 'volume': volume,
    };
  }

  factory Hadith.fromJson(Map<String, dynamic> json) {
    return Hadith(
      id: (json['hadithId'] ?? json['id']) as int,
      bookId: json['bookId']?.toString() ?? '',
      bookName: json['book']?.toString(), // Book title from API
      chapter: json['chapterTitle']?.toString(),
      title: json['title']?.toString(),
      arabic: json['arabicText']?.toString(),
      english: json['englishText']?.toString(),
      narrator: json['narrator']?.toString(),
      // بعض الأحاديث قد تحتوي على أكثر من نوع تقييم، نأخذ أول الموجود
      grade: json['grade']?.toString() ??
          json['majlisiGrading']?.toString() ??
          json['mohseniGrading']?.toString() ??
          json['behbudiGrading']?.toString(),
      reference: json['URL']?.toString(), // هنا نربط URL مع reference
      volume: (json['volume'] as num?)?.toInt(),
    );
  }

  static List<Hadith> listFromJson(String body) {
    final decoded = jsonDecode(body);

    if (decoded is List) {
      return decoded
          .map((e) => Hadith.fromJson(e as Map<String, dynamic>))
          .toList();
    }

    if (decoded is Map && decoded['hadiths'] is List) {
      return (decoded['hadiths'] as List)
          .map((e) => Hadith.fromJson(e as Map<String, dynamic>))
          .toList();
    }

    throw Exception('Unexpected hadith JSON: $decoded');
  }
}
