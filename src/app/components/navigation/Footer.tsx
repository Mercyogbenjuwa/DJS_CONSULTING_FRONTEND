'use client'

const Footer = () => {
  function getCurrentYear(): number {
    return new Date().getFullYear();
  }

  const currentYear = getCurrentYear();

  return (
    <footer className="flex flex-col md:flex-row justify-between bg-indigo-500 text-white px-10 pt-8 pb-6 border-t border-silver space-y-3 md:space-y-0">
      <div>
        <h6 className="text-black70 text-xs leading-[18px]">
          © {currentYear} DigitalTech. All Rights Reserved
        </h6>
      </div>
      <div className="flex gap-8 ">
        <div>
          <p className="text-black70 text-xs leading-[18px] whitespace-nowrap">
            Terms of Service
          </p>
        </div>
        <div>
          <p className="text-black70 text-xs leading-[18px] whitespace-nowrap">
            Cookie Policy
          </p>
        </div>
        <div>
          <p className="text-black70 text-xs leading-[18px] whitespace-nowrap">
            Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
