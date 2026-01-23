# Changelog

All notable changes to the AgroLogistic project will be documented in this file.

## [1.1.0] - 2026-01-22 - Admin Dashboard Release

### Added

#### Admin Dashboard (Frontend + Backend)
- **Complete admin dashboard** with 5 main pages (Dashboard, Users, Analytics, System, Security)
- **17 REST API endpoints** for admin operations
- **Recharts visualizations** (UsersChart, RevenueChart)
- **React Query hooks** for data fetching and caching
- **Form validation** with React Hook Form + Zod
- **Permission system** with 70+ granular permissions and 4 roles
- **Audit logging** for all admin actions
- **JWT RS256 authentication** with automatic token refresh

#### New Dependencies
- `@tanstack/react-query` ^5.90.19
- `axios` ^1.13.2
- `recharts` ^2.15.4
- `react-hook-form` ^7.55.0
- `zod` ^4.3.5
- `sonner` ^2.0.3
- `zustand` ^5.0.10

#### Documentation
- REQUIREMENTS.md - Complete dependencies list
- CHANGELOG.md - Project changelog
- FINALIZATION_GUIDE.md - Deployment guide
- QUICKSTART.md (admin-service)
- Postman collection for API testing

### Changed
- Updated START_APP_SIMPLE.ps1 to include admin-service
- Enhanced API client with retry logic and error handling

### Security
- Bcrypt password hashing (10 rounds)
- Comprehensive audit trail
- CORS and Helmet.js protection
- Input validation on all endpoints

### Fixed
- Port allocation conflicts (admin-service on 5005)

---

## [1.0.0] - 2026-01-15

### Added
- Initial platform release
- User authentication
- Product catalog
- Order management

---

**For detailed changes, see [walkthrough.md](brain/.../walkthrough.md)**
