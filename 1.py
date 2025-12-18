# -*- coding: utf-8 -*-
import os
import shutil
import time
import threading
import json
import glob
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk
import win32com.client as win32
import pythoncom

# === 全局配置 ===
CONFIG_DIR = "config"
DEFAULT_CONFIG_NAME = "默认"

# === 🎨 现代科技感主题 (Dark Tech) ===
THEME = {
    "bg": "#1E1E1E",           # 深灰底色
    "fg": "#E0E0E0",           # 亮白文字
    "accent": "#00ACC1",       # 科技青 (按钮/高亮)
    "accent_hover": "#00838F", # 按钮悬停深青
    "panel_bg": "#252526",     # 面板背景
    "entry_bg": "#333333",     # 输入框背景
    "entry_fg": "#FFFFFF",
    "border": "#3E3E42",       # 边框色
    "success": "#4CAF50",      # 绿色
    "error": "#FF5252",        # 红色
    "warning": "#FFC107"       # 黄色
}

class ModernWPSReplacer:
    def __init__(self, root):
        self.root = root
        self.root.title("Word/WPS 批量替换工具 V11.0 Pro") # 标题更新
        self.root.geometry("1000x850")
        self.root.configure(bg=THEME["bg"])
        
        # 核心变量
        self.is_running = False
        self.is_paused = False
        self.stop_event = threading.Event()
        self.current_config_file = ""
        
        if not os.path.exists(CONFIG_DIR):
            os.makedirs(CONFIG_DIR)

        self.setup_styles()
        self.setup_ui()
        self.init_config_system()
        
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("clam")
        
        style.configure("TFrame", background=THEME["bg"])
        style.configure("TLabel", background=THEME["bg"], foreground=THEME["fg"], font=("Segoe UI", 10))
        style.configure("TButton", 
            font=("Segoe UI", 10, "bold"),
            background=THEME["panel_bg"], 
            foreground=THEME["accent"],
            borderwidth=1,
            focuscolor=THEME["accent"]
        )
        style.map("TButton", 
            background=[('active', THEME["entry_bg"])], 
            foreground=[('active', THEME["accent_hover"])]
        )
        
        style.configure("Accent.TButton", 
            background=THEME["accent"], 
            foreground="white"
        )
        style.map("Accent.TButton", 
            background=[('active', THEME["accent_hover"])],
            foreground=[('active', "white")]
        )

        style.configure("Treeview", 
            background=THEME["entry_bg"], 
            foreground=THEME["fg"], 
            fieldbackground=THEME["entry_bg"],
            borderwidth=0,
            font=("Segoe UI", 10),
            rowheight=25
        )
        style.configure("Treeview.Heading", 
            background=THEME["panel_bg"], 
            foreground=THEME["accent"], 
            font=("Segoe UI", 10, "bold"),
            relief="flat"
        )
        style.map("Treeview", background=[('selected', THEME["accent_hover"])])
        
        style.configure("Horizontal.TProgressbar", 
            troughcolor=THEME["entry_bg"], 
            background=THEME["accent"], 
            thickness=20
        )

    def setup_ui(self):
        # 顶部配置栏
        top_frame = tk.Frame(self.root, bg=THEME["panel_bg"], pady=10, padx=15)
        top_frame.pack(fill="x")
        
        tk.Label(top_frame, text="配置方案:", bg=THEME["panel_bg"], fg=THEME["fg"], font=("Segoe UI", 10, "bold")).pack(side="left")
        
        self.config_var = tk.StringVar()
        self.config_combo = ttk.Combobox(top_frame, textvariable=self.config_var, width=25, state="readonly")
        self.config_combo.pack(side="left", padx=10)
        self.config_combo.bind("<<ComboboxSelected>>", self.on_config_switch)
        
        ttk.Button(top_frame, text="💾 保存当前配置", command=self.save_current_config_action).pack(side="left", padx=5)
        ttk.Button(top_frame, text="🗑 删除", command=self.delete_config_action).pack(side="left", padx=5)

        # 核心内容区
        content_frame = tk.Frame(self.root, bg=THEME["bg"], padx=20, pady=15)
        content_frame.pack(fill="both", expand=True)

        # 路径选择
        path_group = tk.LabelFrame(content_frame, text=" 目标文件夹 ", bg=THEME["bg"], fg=THEME["accent"], font=("Segoe UI", 11, "bold"), bd=1, relief="solid")
        path_group.pack(fill="x", pady=(0, 15), ipady=5)
        
        f_p = tk.Frame(path_group, bg=THEME["bg"], padx=10, pady=5)
        f_p.pack(fill="x")
        self.path_entry = tk.Entry(f_p, bg=THEME["entry_bg"], fg=THEME["fg"], insertbackground="white", bd=0, font=("Segoe UI", 10))
        self.path_entry.pack(side="left", fill="x", expand=True, ipady=4)
        ttk.Button(f_p, text="📁 选择目录", command=self.select_folder).pack(side="left", padx=(10,0))
        
        self.backup_var = tk.BooleanVar(value=True)
        chk = tk.Checkbutton(path_group, text="执行前自动备份整个文件夹 (推荐)", variable=self.backup_var, 
                             bg=THEME["bg"], fg=THEME["fg"], selectcolor=THEME["bg"], activebackground=THEME["bg"], activeforeground=THEME["accent"])
        chk.pack(anchor="w", padx=10)

        # 规则列表
        rule_group = tk.LabelFrame(content_frame, text=" 替换规则列表 ", bg=THEME["bg"], fg=THEME["accent"], font=("Segoe UI", 11, "bold"), bd=1, relief="solid")
        rule_group.pack(fill="both", expand=True)
        
        toolbar = tk.Frame(rule_group, bg=THEME["bg"], padx=5, pady=5)
        toolbar.pack(fill="x")
        ttk.Button(toolbar, text="➕ 添加规则", command=self.add_rule_popup).pack(side="left", padx=2)
        ttk.Button(toolbar, text="✎ 修改选中", command=self.edit_rule_popup).pack(side="left", padx=2)
        ttk.Button(toolbar, text="❌ 删除选中", command=self.delete_rule).pack(side="left", padx=2)
        ttk.Button(toolbar, text="🧹 清空", command=self.clear_rules).pack(side="left", padx=2)
        
        cols = ("old", "new")
        self.tree = ttk.Treeview(rule_group, columns=cols, show="headings", height=8)
        self.tree.heading("old", text="查找内容 (原文本)")
        self.tree.heading("new", text="替换为 (新文本)")
        self.tree.column("old", width=300)
        self.tree.column("new", width=300)
        
        sc = ttk.Scrollbar(rule_group, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscroll=sc.set)
        
        self.tree.pack(side="left", fill="both", expand=True, padx=5, pady=5)
        sc.pack(side="right", fill="y", pady=5)

        # 底部控制区
        bottom_frame = tk.Frame(self.root, bg=THEME["panel_bg"], padx=20, pady=15)
        bottom_frame.pack(fill="x", side="bottom")

        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(bottom_frame, variable=self.progress_var, maximum=100, style="Horizontal.TProgressbar")
        self.progress_bar.pack(fill="x", pady=(0, 10))
        
        self.lbl_status = tk.Label(bottom_frame, text="准备就绪", bg=THEME["panel_bg"], fg="gray")
        self.lbl_status.pack(anchor="w")

        self.log_area = scrolledtext.ScrolledText(bottom_frame, height=8, bg=THEME["entry_bg"], fg=THEME["fg"], 
                                                font=("Consolas", 9), bd=0, insertbackground="white")
        self.log_area.pack(fill="x", pady=5)
        self.log_area.tag_config("error", foreground=THEME["error"])
        self.log_area.tag_config("success", foreground=THEME["success"])
        self.log_area.tag_config("info", foreground="#888888")
        self.log_area.tag_config("wps", foreground=THEME["accent"]) # WPS 专属颜色

        btn_area = tk.Frame(bottom_frame, bg=THEME["panel_bg"], pady=5)
        btn_area.pack(fill="x")
        
        self.btn_start = ttk.Button(btn_area, text="🚀 开始批量替换", style="Accent.TButton", command=self.start_thread)
        self.btn_start.pack(side="right", padx=5, ipadx=10, ipady=5)
        
        self.btn_pause = ttk.Button(btn_area, text="⏸ 暂停", command=self.toggle_pause, state="disabled")
        self.btn_pause.pack(side="right", padx=5)
        
        self.btn_stop = ttk.Button(btn_area, text="🛑 停止", command=self.stop_task, state="disabled")
        self.btn_stop.pack(side="right", padx=5)

    # === 配置管理 ===
    def init_config_system(self):
        self.refresh_config_list()
        default_path = os.path.join(CONFIG_DIR, f"{DEFAULT_CONFIG_NAME}.json")
        if not os.path.exists(default_path):
            self.save_config_file(DEFAULT_CONFIG_NAME, {"path": "", "backup": True, "rules": []})
            self.refresh_config_list()
        
        vals = self.config_combo['values']
        if vals:
            self.config_combo.set(vals[0])
            self.load_config_to_ui(vals[0])

    def refresh_config_list(self):
        files = glob.glob(os.path.join(CONFIG_DIR, "*.json"))
        names = [os.path.basename(f).replace(".json", "") for f in files]
        names.sort()
        self.config_combo['values'] = names
        return names

    def on_config_switch(self, event):
        name = self.config_combo.get()
        self.load_config_to_ui(name)

    def load_config_to_ui(self, name):
        path = os.path.join(CONFIG_DIR, f"{name}.json")
        if not os.path.exists(path): return
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.path_entry.delete(0, tk.END)
            self.tree.delete(*self.tree.get_children())
            self.path_entry.insert(0, data.get("path", ""))
            self.backup_var.set(data.get("backup", True))
            for r in data.get("rules", []): self.tree.insert("", "end", values=r)
            self.log(f"已加载配置: {name}", "info")
            self.current_config_file = name
        except Exception as e:
            self.log(f"配置加载失败: {e}", "error")

    def save_current_config_action(self):
        name = self.config_combo.get().strip()
        if not name or name == DEFAULT_CONFIG_NAME:
            if name == DEFAULT_CONFIG_NAME:
                name = f"配置_{time.strftime('%Y%m%d_%H%M')}"
                self.log(f"默认配置另存为: {name}", "info")
        data = {
            "path": self.path_entry.get(),
            "backup": self.backup_var.get(),
            "rules": [self.tree.item(i)['values'] for i in self.tree.get_children()]
        }
        self.save_config_file(name, data)
        self.refresh_config_list()
        self.config_combo.set(name)
        self.current_config_file = name
        messagebox.showinfo("成功", f"配置 '{name}' 已保存")

    def save_config_file(self, name, data):
        path = os.path.join(CONFIG_DIR, f"{name}.json")
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.log(f"保存文件失败: {e}", "error")

    def delete_config_action(self):
        name = self.config_combo.get()
        if name == DEFAULT_CONFIG_NAME:
            messagebox.showwarning("禁止", "无法删除默认配置！")
            return
        if messagebox.askyesno("确认", f"确定删除配置 '{name}' 吗？"):
            path = os.path.join(CONFIG_DIR, f"{name}.json")
            if os.path.exists(path):
                os.remove(path)
                self.refresh_config_list()
                self.config_combo.set(DEFAULT_CONFIG_NAME)
                self.load_config_to_ui(DEFAULT_CONFIG_NAME)

    # === 核心逻辑 (兼容 WPS) ===
    def start_thread(self):
        folder = self.path_entry.get()
        rules = [self.tree.item(i)['values'] for i in self.tree.get_children()]
        if not folder or not os.path.exists(folder):
            messagebox.showerror("错误", "请选择有效的文件夹路径！")
            return
        if not rules:
            messagebox.showwarning("警告", "规则列表为空！")
            return

        self.is_running = True
        self.is_paused = False
        self.stop_event.clear()
        
        self.btn_start.config(state="disabled")
        self.btn_pause.config(state="normal", text="⏸ 暂停")
        self.btn_stop.config(state="normal")
        self.log_area.delete(1.0, tk.END)
        self.progress_var.set(0)
        
        t = threading.Thread(target=self.run_process, args=(folder, rules))
        t.daemon = True
        t.start()

    def run_process(self, folder_path, rules):
        pythoncom.CoInitialize() 
        stats = {"success": 0, "fail": 0, "skip": 0}
        failed_files = []
        
        app = None
        try:
            # 1. 扫描文件
            self.log("🔍 正在扫描文件...", "info")
            file_list = []
            for root_dir, _, files in os.walk(folder_path):
                for f in files:
                    if f.lower().endswith(('.doc', '.docx')) and not f.startswith('~$'):
                        file_list.append(os.path.join(root_dir, f))
            
            total_files = len(file_list)
            if total_files == 0:
                self.log("❌ 未找到 Word 文件", "error")
                self.reset_ui()
                return
            
            self.root.after(0, lambda: self.progress_bar.configure(maximum=total_files))

            # 2. 备份
            if self.backup_var.get():
                self.log("⏳ 正在备份...", "info")
                try:
                    parent = os.path.dirname(folder_path)
                    bk_name = f"{os.path.basename(folder_path)}_backup_{time.strftime('%H%M%S')}"
                    shutil.copytree(folder_path, os.path.join(parent, bk_name))
                    self.log("✅ 备份完成", "success")
                except Exception as e:
                    self.log(f"❌ 备份失败: {e}", "error")
                    if not messagebox.askyesno("警告", "备份失败，是否继续执行？"):
                        self.reset_ui()
                        return

            # 3. 启动引擎 (重点修改：兼容 WPS)
            self.log("🔧 正在尝试连接 WPS 或 Word...", "info")
            
            # 优先尝试 WPS，后尝试 MS Word
            # Kwps.Application = WPS
            # Wps.Application = WPS (旧版)
            # Word.Application = MS Word
            prog_ids = ["Kwps.Application", "Wps.Application", "Word.Application"]
            
            app_name = "Unknown"
            for pid in prog_ids:
                try:
                    app = win32.Dispatch(pid)
                    app_name = "WPS Office" if "wps" in pid.lower() else "Microsoft Word"
                    self.log(f"✅ 成功连接到: {app_name} ({pid})", "wps")
                    break
                except:
                    continue
            
            if not app:
                self.log("❌ 启动失败：未检测到 WPS 或 Word，请确认已安装。", "error")
                messagebox.showerror("错误", "无法启动办公软件 (WPS/Word)。\n请确认软件已正确安装。")
                self.reset_ui()
                return

            # 配置静默运行
            try:
                app.Visible = False # WPS 有时会忽略这个，但这行必须要有
                app.DisplayAlerts = 0 
                # WPS 可能不支持 ScreenUpdating，加 try 防止报错
                try: app.ScreenUpdating = False 
                except: pass
            except: pass

            # 4. 循环处理
            for idx, file_path in enumerate(file_list):
                if not self.is_running: break
                while self.is_paused:
                    time.sleep(0.5)
                    if not self.is_running: break

                filename = os.path.basename(file_path)
                self.lbl_status.config(text=f"正在处理: {filename} ({idx+1}/{total_files})")
                
                doc = None
                try:
                    # 打开文件
                    doc = app.Documents.Open(file_path)
                    
                    # 替换
                    for old_txt, new_txt in rules:
                        # WPS 接口与 Word 基本一致
                        find_obj = doc.Content.Find
                        find_obj.Execute(str(old_txt), False, False, False, False, False, True, 1, False, str(new_txt), 2)
                    
                    # 保存并关闭
                    doc.Close(SaveChanges=True)
                    doc = None
                    stats["success"] += 1
                    self.log(f"✅ 完成: {filename}", "success")
                    
                except Exception as e:
                    stats["fail"] += 1
                    failed_files.append(filename)
                    self.log(f"❌ 失败: {filename} - {str(e)}", "error")
                    try: 
                        if doc: doc.Close(SaveChanges=False)
                    except: pass
                
                self.root.after(0, lambda v=idx+1: self.progress_var.set(v))

            try: app.Quit()
            except: pass

            if self.is_running:
                self.lbl_status.config(text="任务完成")
                self.show_report(stats, failed_files)
            else:
                self.log("🛑 任务被用户终止", "warning")

        except Exception as e:
            self.log(f"🔥 系统致命错误: {e}", "error")
        finally:
            pythoncom.CoUninitialize()
            self.reset_ui()

    def show_report(self, stats, failed_list):
        msg = f"处理完成！\n\n✅ 成功: {stats['success']} 个\n❌ 失败: {stats['fail']} 个"
        if failed_list:
            msg += "\n\n失败文件列表:\n" + "\n".join(failed_list[:10])
            if len(failed_list) > 10: msg += "\n..."
            self.log("\n====== 失败文件汇总 ======", "error")
            for f in failed_list: self.log(f, "error")
        messagebox.showinfo("执行报告", msg)

    # 辅助功能保持不变...
    def log(self, msg, tag=None):
        def _log():
            self.log_area.insert(tk.END, f"[{time.strftime('%H:%M:%S')}] {msg}\n", tag)
            self.log_area.see(tk.END)
        self.root.after(0, _log)
    def select_folder(self):
        f = filedialog.askdirectory()
        if f: 
            self.path_entry.delete(0, tk.END)
            self.path_entry.insert(0, f)
    def toggle_pause(self):
        if not self.is_running: return
        self.is_paused = not self.is_paused
        self.btn_pause.config(text="▶ 继续" if self.is_paused else "⏸ 暂停")
        self.log("⏸ 任务暂停" if self.is_paused else "▶ 任务继续", "info")
    def stop_task(self):
        if self.is_running:
            self.is_running = False
            self.btn_stop.config(state="disabled")
    def reset_ui(self):
        self.is_running = False
        self.btn_start.config(state="normal")
        self.btn_pause.config(state="disabled", text="⏸ 暂停")
        self.btn_stop.config(state="disabled")
        self.lbl_status.config(text="就绪")
    def rule_dialog(self, title, old_val="", new_val="", item_id=None):
        win = tk.Toplevel(self.root)
        win.title(title)
        win.geometry("500x250")
        win.configure(bg=THEME["bg"])
        def input_field(label, val):
            tk.Label(win, text=label, bg=THEME["bg"], fg=THEME["fg"], font=("Segoe UI", 10)).pack(anchor="w", padx=20, pady=(15, 5))
            e = tk.Entry(win, width=50, bg=THEME["entry_bg"], fg=THEME["entry_fg"], insertbackground="white", bd=0)
            e.pack(padx=20, ipady=4, fill="x")
            e.insert(0, val)
            return e
        e1 = input_field("查找内容:", old_val)
        e2 = input_field("替换为:", new_val)
        def save():
            o, n = e1.get(), e2.get()
            if not o: return messagebox.showerror("错误", "查找内容不能为空", parent=win)
            if item_id: self.tree.item(item_id, values=(o, n))
            else: self.tree.insert("", "end", values=(o, n))
            win.destroy()
        btn_frame = tk.Frame(win, bg=THEME["bg"], pady=20)
        btn_frame.pack()
        ttk.Button(btn_frame, text="确认保存", style="Accent.TButton", command=save).pack(ipadx=10)
    def add_rule_popup(self): self.rule_dialog("添加新规则")
    def edit_rule_popup(self):
        s = self.tree.selection()
        if s: self.rule_dialog("修改规则", self.tree.item(s[0])['values'][0], self.tree.item(s[0])['values'][1], s[0])
        else: messagebox.showinfo("提示", "请先选择一行规则")
    def delete_rule(self):
        for i in self.tree.selection(): self.tree.delete(i)
    def clear_rules(self):
        if messagebox.askyesno("确认", "确定清空所有规则吗？"):
            self.tree.delete(*self.tree.get_children())
    def on_close(self):
        if self.is_running:
            if not messagebox.askyesno("警告", "任务正在运行，强制退出可能导致 Word 进程残留，确定退出吗？"):
                return
            self.is_running = False
        self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = ModernWPSReplacer(root)
    root.mainloop()