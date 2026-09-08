-- ArogyaGrid Seed Data
-- Migration: seed_work_items.sql

BEGIN;

INSERT INTO core.facilities (id, code, name, facility_type, district, state) VALUES
('00000000-0000-0000-0000-000000000001', 'FAC-001', 'PHC Nayapalli', 'phc', 'Khurda', 'Odisha'),
('00000000-0000-0000-0000-000000000002', 'FAC-002', 'PHC Saheed Nagar', 'phc', 'Khurda', 'Odisha'),
('00000000-0000-0000-0000-000000000003', 'FAC-003', 'PHC Bhubaneswar Central', 'phc', 'Khurda', 'Odisha'),
('00000000-0000-0000-0000-000000000004', 'FAC-004', 'District Hospital Cuttack', 'dh', 'Cuttack', 'Odisha');

INSERT INTO iam.users (id, email, display_name, password_hash, role, facility_id, district) VALUES
('11111111-0000-0000-0000-000000000001', 'sarthak@arogyagrid.in', 'Sarthak', 'hash', 'national_admin', NULL, NULL),
('11111111-0000-0000-0000-000000000002', 'vaishnavi@arogyagrid.in', 'Vaishnavi', 'hash', 'district_officer', NULL, 'Khurda'),
('11111111-0000-0000-0000-000000000003', 'riya@arogyagrid.in', 'Riya', 'hash', 'facility_manager', '00000000-0000-0000-0000-000000000001', 'Khurda'),
('11111111-0000-0000-0000-000000000004', 'shneanjali@arogyagrid.in', 'Shneanjali', 'hash', 'facility_manager', '00000000-0000-0000-0000-000000000002', 'Khurda');

INSERT INTO iam.teams (id, name, team_type, facility_id, district) VALUES
('22222222-0000-0000-0000-000000000001', 'District Supply Team', 'supply', NULL, 'Khurda'),
('22222222-0000-0000-0000-000000000002', 'PHC Nayapalli Inventory', 'inventory', '00000000-0000-0000-0000-000000000001', 'Khurda'),
('22222222-0000-0000-0000-000000000003', 'PHC Saheed Nagar Logistics', 'logistics', '00000000-0000-0000-0000-000000000002', 'Khurda');

INSERT INTO iam.team_members (team_id, user_id, role) VALUES
('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'leader'),
('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003', 'leader'),
('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004', 'leader');

-- Work items
INSERT INTO work.work_items (id, type, priority, title, status, assigned_user_id, facility_id, due_at, created_at) VALUES
('33333333-0000-0000-0000-000000000001', 'STOCK_SHORTAGE_REVIEW', 'critical', 'Review critical paracetamol shortage', 'assigned', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', now() + interval '1 day', now()),
('33333333-0000-0000-0000-000000000002', 'STOCK_SHORTAGE_REVIEW', 'critical', 'Review amoxicillin shortage', 'waiting', NULL, '00000000-0000-0000-0000-000000000001', now() + interval '1 day', now()),
('33333333-0000-0000-0000-000000000003', 'TRANSFER_RECOMMENDATION_APPROVAL', 'normal', 'Approve transfer to Nayapalli', 'assigned', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', now() + interval '2 days', now()),
('33333333-0000-0000-0000-000000000004', 'TRANSFER_RECOMMENDATION_APPROVAL', 'normal', 'Approve transfer from Cuttack', 'assigned', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', now() + interval '2 days', now()),
('33333333-0000-0000-0000-000000000005', 'TRANSFER_DISPATCH', 'high', 'Dispatch supplies to Saheed Nagar', 'in_progress', '11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', now() + interval '12 hours', now()),
('33333333-0000-0000-0000-000000000006', 'TRANSFER_RECEIPT', 'normal', 'Receive supplies from central hub', 'assigned', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', now() + interval '3 days', now()),
('33333333-0000-0000-0000-000000000007', 'INVENTORY_DISCREPANCY', 'normal', 'Resolve ORS count discrepancy', 'waiting', NULL, '00000000-0000-0000-0000-000000000001', now() + interval '5 days', now()),
('33333333-0000-0000-0000-000000000008', 'CAPACITY_OVERLOAD', 'urgent', 'Address bed overload at District Hospital', 'assigned', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', now() + interval '4 hours', now()),
('33333333-0000-0000-0000-000000000009', 'EXPIRY_RISK', 'high', 'Vaccines expiring soon', 'assigned', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', now() - interval '1 day', now() - interval '2 days'),
('33333333-0000-0000-0000-000000000010', 'STOCK_SHORTAGE_REVIEW', 'low', 'Review bandages stock', 'completed', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', now(), now() - interval '5 days'),
('33333333-0000-0000-0000-000000000011', 'DATA_QUALITY_ISSUE', 'normal', 'Fix malformed patient data', 'completed', '11111111-0000-0000-0000-000000000002', NULL, now(), now() - interval '3 days');

COMMIT;
