 let mangDuLieu = [];       // Mảng 2 chiều để lưu số từ 1 đến 15
        let hangOTrong = 3;        // Vị trí hàng của ô màu đen (0, 1, 2, 3)
        let cotOTrong = 3;         // Vị trí cột của ô màu đen (0, 1, 2, 3)
        
        let dangChoi = false;      // Kiểm tra xem đã bấm bắt đầu chưa
        let thoiGian = 0;          // Lưu số giây
        let boDemGio;              // Biến để chạy hàm setInterval
        let lanChoi = 0;           // Đếm số lần chơi

        // Hàm 1: Chuẩn bị mảng dữ liệu gốc lúc mới vào (hoặc lúc thắng)
        function khoiTaoMang() {
            mangDuLieu = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 0] // 0 tượng trưng cho ô đen
            ];
            hangOTrong = 3;
            cotOTrong = 3;
        }

        // Hàm 2: Vẽ mảng dữ liệu ra màn hình HTML
        function veBanCo() {
            let khungBanCo = document.getElementById("khung-ban-co");
            khungBanCo.innerHTML = ""; // Xoá sạch cái cũ để vẽ lại

            // Duyệt qua 4 hàng và 4 cột
            for (let h = 0; h < 4; h++) {
                for (let c = 0; c < 4; c++) {
                    let giaTri = mangDuLieu[h][c];
                    
                    // Tạo ra thẻ <div>
                    let oCo = document.createElement("div");
                    
                    if (giaTri === 0) {
                        oCo.className = "o-co o-trong"; // Nếu là số 0 thì gán class ô đen
                        oCo.innerText = "";
                    } else {
                        oCo.className = "o-co";
                        oCo.innerText = giaTri; // Ghi số vào ô
                    }

                    khungBanCo.appendChild(oCo); // Thêm ô vào khung
                }
            }
        }

        // Hàm 3: Xử lý khi bấm nút "Bắt đầu" hoặc "Kết thúc"
        function xuLyNutBatDau() {
            let nutBatDau = document.getElementById("nut-bat-dau");

            if (dangChoi == false) {
                // BẮT ĐẦU CHƠI
                dangChoi = true;
                nutBatDau.innerText = "Kết thúc";
                nutBatDau.style.backgroundColor = "red"; // Đổi nút thành màu đỏ

                // Bắt đầu đếm giờ
                thoiGian = 0;
                document.getElementById("dong-ho").innerText = "00:00";
                
                clearInterval(boDemGio); // Dọn dẹp bộ đếm cũ nếu có
                boDemGio = setInterval(function() {
                    thoiGian++;
                    
                    // Tính phút và giây
                    let phut = Math.floor(thoiGian / 60);
                    let giay = thoiGian % 60;
                    
                    // Thêm số 0 đằng trước nếu nhỏ hơn 10 (ví dụ 09)
                    if (phut < 10) phut = "0" + phut;
                    if (giay < 10) giay = "0" + giay;
                    
                    document.getElementById("dong-ho").innerText = phut + ":" + giay;
                }, 1000); // 1000 mili-giây = 1 giây

                // Trộn bảng 100 lần
                tronBanCo(100);

            } else {
                // KẾT THÚC / DỪNG CHƠI (Bỏ cuộc)
                ketThucGame("Chưa hoàn thành");
            }
        }

        // Hàm 4: Trộn bàn cờ bằng cách di chuyển ô trống ngẫu nhiên
        function tronBanCo(soLan) {
            khoiTaoMang(); // Đưa về gốc trước khi trộn

            for (let i = 0; i < soLan; i++) {
                let huongNgauNhien = Math.floor(Math.random() * 4); // Random từ 0 đến 3
                
                let hangMoi = hangOTrong;
                let cotMoi = cotOTrong;

                // Quy ước: 0 là Lên, 1 là Xuống, 2 là Trái, 3 là Phải
                if (huongNgauNhien === 0) hangMoi = hangMoi - 1; // Lên
                if (huongNgauNhien === 1) hangMoi = hangMoi + 1; // Xuống
                if (huongNgauNhien === 2) cotMoi = cotMoi - 1;   // Trái
                if (huongNgauNhien === 3) cotMoi = cotMoi + 1;   // Phải

                // Chỉ trộn nếu ô mới không bị lọt ra ngoài khung (phải từ 0 đến 3)
                if (hangMoi >= 0 && hangMoi <= 3 && cotMoi >= 0 && cotMoi <= 3) {
                    // Hoán đổi giá trị của ô hiện tại và ô mới
                    mangDuLieu[hangOTrong][cotOTrong] = mangDuLieu[hangMoi][cotMoi];
                    mangDuLieu[hangMoi][cotMoi] = 0;
                    
                    // Cập nhật lại vị trí mới của ô đen
                    hangOTrong = hangMoi;
                    cotOTrong = cotMoi;
                }
            }
            veBanCo(); // Trộn xong thì vẽ lại
        }

        // Hàm 5: Lắng nghe bàn phím khi người chơi bấm
        window.addEventListener("keydown", function(suKien) {
            // Ngăn trình duyệt cuộn trang khi bấm mũi tên
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(suKien.key)) {
                suKien.preventDefault();
            }

            // Nếu chưa bấm Bắt đầu thì không cho di chuyển
            if (dangChoi == false) return;

            let hangMoi = hangOTrong;
            let cotMoi = cotOTrong;

            // Kiểm tra người dùng bấm phím gì
            if (suKien.key === "w" || suKien.key === "ArrowUp") {
                hangMoi = hangOTrong - 1; // Ô đen đi LÊN
            } 
            else if (suKien.key === "s" || suKien.key === "ArrowDown") {
                hangMoi = hangOTrong + 1; // Ô đen đi XUỐNG
            } 
            else if (suKien.key === "a" || suKien.key === "ArrowLeft") {
                cotMoi = cotOTrong - 1;   // Ô đen qua TRÁI
            } 
            else if (suKien.key === "d" || suKien.key === "ArrowRight") {
                cotMoi = cotOTrong + 1;   // Ô đen qua PHẢI
            } 
            else {
                return; // Bấm phím khác thì không làm gì cả
            }

            // Kiểm tra điều kiện ĐIỂM TỚI HẠN (không văng ra ngoài khung 4x4)
            if (hangMoi >= 0 && hangMoi <= 3 && cotMoi >= 0 && cotMoi <= 3) {
                // Đổi chỗ
                mangDuLieu[hangOTrong][cotOTrong] = mangDuLieu[hangMoi][cotMoi];
                mangDuLieu[hangMoi][cotMoi] = 0;
                
                // Cập nhật toạ độ ô đen
                hangOTrong = hangMoi;
                cotOTrong = cotMoi;

                veBanCo(); // Vẽ lại giao diện
                kiemTraThang(); // Sau khi đi xong thì kiểm tra xem thắng chưa
            }
        });

        // Hàm 6: Kiểm tra xem các số đã xếp đúng thứ tự 1-15 chưa
        function kiemTraThang() {
            let dem = 1;
            let thang = true;

            // Quét từ trên xuống dưới, trái qua phải
            for (let h = 0; h < 4; h++) {
                for (let c = 0; c < 4; c++) {
                    if (h === 3 && c === 3) {
                        // Ô cuối cùng (góc dưới phải) phải là số 0
                        if (mangDuLieu[h][c] !== 0) thang = false;
                    } else {
                        // Các ô khác phải tăng dần từ 1, 2, 3...
                        if (mangDuLieu[h][c] !== dem) {
                            thang = false;
                        }
                        dem++;
                    }
                }
            }

            if (thang == true) {
                setTimeout(function() {
                    let thoiGianHienTai = document.getElementById("dong-ho").innerText;
                    alert("Chúc mừng! Bạn đã hoàn thành trò chơi trong " + thoiGianHienTai);
                    ketThucGame("Hoàn thành");
                }, 100); // Đợi 100ms cho ô cờ vẽ xong rồi mới hiện thông báo
            }
        }

        // Hàm 7: Kết thúc game và ghi vào bảng lịch sử
        function ketThucGame(ketQua) {
            dangChoi = false;
            clearInterval(boDemGio); // Dừng đếm giờ
            
            // Sửa lại nút thành Bắt đầu màu xanh
            let nutBatDau = document.getElementById("nut-bat-dau");
            nutBatDau.innerText = "Bắt đầu";
            nutBatDau.style.backgroundColor = "#2563eb";

            // Thêm vào bảng lịch sử
            lanChoi++;
            let thoiGianHienThi = document.getElementById("dong-ho").innerText;
            
            let htmlMoi = "<tr>";
            htmlMoi += "<td>" + lanChoi + "</td>";
            htmlMoi += "<td>" + thoiGianHienThi + "</td>";
            
            // Nếu thắng thì chữ xanh, nếu chưa xong thì chữ đỏ
            if (ketQua === "Hoàn thành") {
                htmlMoi += "<td style='color: green; font-weight: bold;'>" + ketQua + "</td>";
            } else {
                htmlMoi += "<td style='color: red;'>" + ketQua + "</td>";
            }
            htmlMoi += "</tr>";

            let bangLichSu = document.getElementById("bang-lich-su");
            bangLichSu.innerHTML = htmlMoi + bangLichSu.innerHTML; // Chèn lên đầu bảng
        }

        // Chạy lần đầu tiên khi mở trang web
        khoiTaoMang();
        veBanCo();
