'use client';
import React, { useEffect, useRef } from 'react';

const Topbar = () => {
  const underlineRef = useRef<HTMLDivElement>(null);

  const updateUnderline = (el: HTMLElement) => {
    if (underlineRef.current) {
      underlineRef.current.style.left = `${el.offsetLeft}px`;
      underlineRef.current.style.width = `${el.offsetWidth}px`;
    }
  };

  useEffect(() => {
    const topLinks = document.querySelectorAll('.top-link');
    //const underline = underlineRef.current;

    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      topLinks.forEach((l) => l.classList.remove('active'));
      target.classList.add('active');
      updateUnderline(target);
    };

    topLinks.forEach((link) => {
      link.addEventListener('click', handleClick);
    });

    const handleResize = () => {
      const activeLink = document.querySelector('.top-link.active') as HTMLElement;
      if (activeLink) updateUnderline(activeLink);
    };

    const sidebar = document.querySelector('.sidebar');
    const observer = new MutationObserver(() => {
      handleResize();
    });

    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    // Initial position
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      topLinks.forEach((link) => {
        link.removeEventListener('click', handleClick);
      });
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="top-bar">
      <div className="top-links">
        <a href="#" className="top-link active">Accounting</a>
        <a href="#" className="top-link">Human Resource</a>
        <a href="#" className="top-link">Inventory</a>
        <a href="#" className="top-link">Operational</a>
        <div className="link-underline" ref={underlineRef}></div>
      </div>
    </div>
  );
};

export default Topbar;
