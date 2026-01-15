// lib/providers/thaqalayn_provider.dart
import 'package:flutter/foundation.dart';
import '../../dataBases/models/thaqalayn_models.dart';
import '../../dataBases/repositories/thaqalayn_repository.dart';
import '../../dataBases/Database_helper.dart';

class ThaqalaynProvider extends ChangeNotifier {
  final ThaqalaynRepository repository;

  ThaqalaynProvider({required this.repository});

  // Books
  List<Book> _books = [];
  List<Book> get books => _books;

  bool _isLoadingBooks = false;
  bool get isLoadingBooks => _isLoadingBooks;

  String? _booksError;
  String? get booksError => _booksError;

  // Random hadith
  Hadith? _randomHadith;
  Hadith? get randomHadith => _randomHadith;

  bool _isLoadingRandom = false;
  bool get isLoadingRandom => _isLoadingRandom;

  String? _randomError;
  String? get randomError => _randomError;

  // Hadith list for selected book (in-memory only)
  Map<String, List<Hadith>> _bookHadithsCache = {};
  bool _isLoadingBookHadiths = false;
  bool get isLoadingBookHadiths => _isLoadingBookHadiths;

  String? _bookHadithsError;
  String? get bookHadithsError => _bookHadithsError;

  // Search results
  List<Hadith> _searchResults = [];
  List<Hadith> get searchResults => _searchResults;

  bool _isSearching = false;
  bool get isSearching => _isSearching;

  String? _searchError;
  String? get searchError => _searchError;

  // ─────────────────────────────────────────────
  // Init from local SQLite cache (called in main)
  // ─────────────────────────────────────────────
  Future<void> initFromLocal() async {
    _isLoadingBooks = true;
    _booksError = null;
    _randomError = null;
    notifyListeners();

    try {
      // 1) Load cached books from DB
      final cachedBooks = await DatabaseHelper.getBooksCache();
      if (cachedBooks.isNotEmpty) {
        _books = cachedBooks;
      }

      // 2) Load last random hadith if saved
      final lastRandom = await DatabaseHelper.getLastRandom();
      if (lastRandom != null) {
        _randomHadith = lastRandom;
      }
    } catch (e) {
      // Optional: you can store this if you want
      _booksError ??= e.toString();
    } finally {
      _isLoadingBooks = false;
      notifyListeners();
    }
  }

  // ---------- Actions ----------

  Future<void> loadBooks({bool forceRefresh = false}) async {
    _isLoadingBooks = true;
    _booksError = null;
    notifyListeners();

    try {
      _books = await repository.getAllBooks(forceRefresh: forceRefresh);
    } catch (e) {
      _booksError = e.toString();
    } finally {
      _isLoadingBooks = false;
      notifyListeners();
    }
  }

  Future<void> fetchRandomHadith({String? bookId}) async {
    _isLoadingRandom = true;
    _randomError = null;
    notifyListeners();

    try {
      _randomHadith = await repository.getRandomHadith(bookId: bookId);
    } catch (e) {
      _randomError = e.toString();
    } finally {
      _isLoadingRandom = false;
      notifyListeners();
    }
  }

  Future<void> loadHadithOfBook(
      String bookId, {
        bool forceRefresh = false,
      }) async {
    _isLoadingBookHadiths = true;
    _bookHadithsError = null;
    notifyListeners();

    try {
      final list = await repository.getAllHadithOfBook(
        bookId,
        forceRefresh: forceRefresh,
      );
      _bookHadithsCache[bookId] = list;
    } catch (e) {
      _bookHadithsError = e.toString();
    } finally {
      _isLoadingBookHadiths = false;
      notifyListeners();
    }
  }

  List<Hadith> getHadithOfBookFromCache(String bookId) {
    return _bookHadithsCache[bookId] ?? [];
  }

  Future<void> searchAllBooks(String query) async {
    if (query.trim().isEmpty) {
      _searchResults = [];
      _searchError = null;
      notifyListeners();
      return;
    }

    _isSearching = true;
    _searchError = null;
    notifyListeners();

    try {
      _searchResults = await repository.searchAllBooks(query);
    } catch (e) {
      _searchError = e.toString();
    } finally {
      _isSearching = false;
      notifyListeners();
    }
  }

  Future<void> searchInBook(String bookId, String query) async {
    if (query.trim().isEmpty) {
      _searchResults = [];
      _searchError = null;
      notifyListeners();
      return;
    }

    _isSearching = true;
    _searchError = null;
    notifyListeners();

    try {
      _searchResults = await repository.searchInBook(bookId, query);
    } catch (e) {
      _searchError = e.toString();
    } finally {
      _isSearching = false;
      notifyListeners();
    }
  }

  void clearSearch() {
    _searchResults = [];
    _searchError = null;
    notifyListeners();
  }
}
