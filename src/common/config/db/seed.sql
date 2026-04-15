-- Insert mock movie
INSERT INTO movies (title, duration, showtime) VALUES 
('Dhurandhar The Revenge', 135, '7:00 PM')
ON CONFLICT DO NOTHING;

-- Insert 20 available seats
INSERT INTO seats (name, isbooked) VALUES
('A1', 0), ('A2', 0), ('A3', 0), ('A4', 0), ('A5', 0),
('B1', 0), ('B2', 0), ('B3', 0), ('B4', 0), ('B5', 0),
('C1', 0), ('C2', 0), ('C3', 0), ('C4', 0), ('C5', 0),
('D1', 0), ('D2', 0), ('D3', 0), ('D4', 0), ('D5', 0)
ON CONFLICT DO NOTHING;